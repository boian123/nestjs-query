import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Class, MapReflector, Query } from '@nestjs-query/core';
import { NotImplementedException } from '@nestjs/common';
import { SkipIf } from '../../../decorators';
import { PagingStrategies } from '../../query';
import { createPager } from './pager';
import { BaseConnectionOptions, Count, CountFn, QueryMany, StaticConnection } from '../interfaces';
import { EdgeType } from './edge.type';
import { PageInfoType } from './page-info.type';
import { getGraphqlObjectName } from '../../../common';

export interface CursorConnectionOptions extends BaseConnectionOptions {
  pagingStrategy?: PagingStrategies.CURSOR;
}

export type StaticCursorConnectionType<DTO> = StaticConnection<DTO, CursorConnectionType<DTO>>;

export type CursorConnectionType<DTO> = {
  pageInfo: PageInfoType;
  edges: EdgeType<DTO>[];
  totalCount?: Promise<number>;
};

const DEFAULT_COUNT = () => Promise.reject(new NotImplementedException('totalCount not implemented'));

const reflector = new MapReflector('nestjs-query:cursor-connection-type');

function getOrCreateConnectionName<DTO>(DTOClass: Class<DTO>, opts: CursorConnectionOptions): string {
  const { connectionName } = opts;
  if (connectionName) {
    return connectionName;
  }
  const objName = getGraphqlObjectName(DTOClass, 'Unable to make ConnectionType.');
  return `${objName}Connection`;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare -- intentional
export function CursorConnectionType<DTO>(
  TItemClass: Class<DTO>,
  maybeOpts?: CursorConnectionOptions,
): StaticCursorConnectionType<DTO> {
  const opts = maybeOpts ?? { pagingStrategy: PagingStrategies.CURSOR };
  const connectionName = getOrCreateConnectionName(TItemClass, opts);
  return reflector.memoize(TItemClass, connectionName, () => {
    const pager = createPager<DTO>(TItemClass, opts);
    const E = EdgeType(TItemClass);
    const PIT = PageInfoType();
    @ObjectType(connectionName)
    class AbstractConnection implements CursorConnectionType<DTO> {
      static get resolveType() {
        return this;
      }

      static async createFromPromise(
        queryMany: QueryMany<DTO>,
        query: Query<DTO>,
        count?: Count<DTO>,
      ): Promise<AbstractConnection> {
        const { pageInfo, edges, totalCount } = await pager.page(queryMany, query, count ?? DEFAULT_COUNT);
        return new AbstractConnection(
          // create the appropriate graphql instance
          new PIT(pageInfo.hasNextPage, pageInfo.hasPreviousPage, pageInfo.startCursor, pageInfo.endCursor),
          edges.map(({ node, cursor }) => new E(node, cursor)),
          totalCount,
        );
      }

      private readonly totalCountFn: CountFn;

      constructor(pageInfo?: PageInfoType, edges?: EdgeType<DTO>[], totalCountFn?: CountFn) {
        this.pageInfo = pageInfo ?? { hasNextPage: false, hasPreviousPage: false };
        this.edges = edges ?? [];
        this.totalCountFn = totalCountFn ?? DEFAULT_COUNT;
      }

      @Field(() => PIT, { description: 'Paging information' })
      pageInfo!: PageInfoType;

      @Field(() => [E], { description: 'Array of edges.' })
      edges!: EdgeType<DTO>[];

      @SkipIf(() => !opts.enableTotalCount, Field(() => Int, { description: 'Fetch total count of records' }))
      get totalCount(): Promise<number> {
        return this.totalCountFn();
      }
    }
    return AbstractConnection;
  });
}
