(window.webpackJsonp=window.webpackJsonp||[]).push([[97],{231:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return a})),n.d(t,"metadata",(function(){return s})),n.d(t,"rightToc",(function(){return c})),n.d(t,"default",(function(){return l}));var r=n(2),o=n(9),i=(n(0),n(258)),a={title:"Multiple Databases"},s={id:"persistence/typeorm/multiple-databases",title:"Multiple Databases",description:"TypeOrm offers the possibility to connect your application to multiple databases or schemas. More details on this can be found on their official documentation.",source:"@site/docs/persistence/typeorm/multiple-databases.md",permalink:"/nestjs-query/docs/persistence/typeorm/multiple-databases",editUrl:"https://github.com/doug-martin/nestjs-query/edit/master/documentation/docs/persistence/typeorm/multiple-databases.md",sidebar:"docs",previous:{title:"Custom Service",permalink:"/nestjs-query/docs/persistence/typeorm/custom-service"},next:{title:"Soft Delete",permalink:"/nestjs-query/docs/persistence/typeorm/soft-delete"}},c=[{value:"Defining multiple connections",id:"defining-multiple-connections",children:[]},{value:"Create a new Feature Module",id:"create-a-new-feature-module",children:[]},{value:"Custom TypeOrmQueryService",id:"custom-typeormqueryservice",children:[]}],p={rightToc:c};function l(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(i.b)("wrapper",Object(r.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,Object(i.b)("inlineCode",{parentName:"p"},"TypeOrm")," offers the possibility to connect your application to multiple databases or schemas. More details on this can be found on their ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"https://typeorm.io/#/multiple-connections"}),"official documentation"),"."),Object(i.b)("p",null,"Further, the official ",Object(i.b)("inlineCode",{parentName:"p"},"@nestjs/typeorm")," package also provides functionality to support multiple databases within the application. For details, consider the ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"https://docs.nestjs.com/techniques/database#multiple-databases"}),"official documentation"),"."),Object(i.b)("p",null,"Therefore, ",Object(i.b)("inlineCode",{parentName:"p"},"@nestjs-query/query-typeorm")," also offers this functionality. This section will walk you through a short example indicating how to connect your application to multiple databases. Further, this will assume, that you ",Object(i.b)("strong",{parentName:"p"},"already have a working application with a configured database"),". Please note that only key aspects are shown here:"),Object(i.b)("h2",{id:"defining-multiple-connections"},"Defining multiple connections"),Object(i.b)("p",null,"First lets set up a constants file to hold our connection names."),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts",metastring:'title="constants.ts"',title:'"constants.ts"'}),"export const MUSIC_DB_CONNECTION = 'default';\nexport const SECRET_DB_CONNECTION = 'secret';\n")),Object(i.b)("p",null,"Then setup multiple database connections."),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts",metastring:'title="app.module.ts"',title:'"app.module.ts"'}),"import { MUSIC_DB_CONNECTION, SECRET_DB_CONNECTION } from './constants';\n\nconst musicEntities = [\n  ArtistEntity,\n  AlbumEntity,\n  SongEntity,\n  GenreEntity,\n  // ...\n];\n\nconst secretEntities = [SecretEntity];\n\n@Module({\n  imports: [\n    ConfigModule.forRoot(environment),\n    TypeOrmModule.forRoot({\n      // name: MUSIC_DB_CONNECTION, // if you leave this out, this will be the \"default\" connection!\n      type: \"postgres\",\n      host: \"localhost\",\n      port: 5436,\n      username: 'user',\n      password: 'password',\n      database: 'music',\n      synchronize: true,\n      logging: true,\n      entities: musicEntities,\n    }),\n    // this also works with the ASYNC configuration!\n    TypeOrmModule.forRootAsync({\n      name: SECRET_DB_CONNECTION,   // you need to set the name here!\n      imports: [ConfigModule],\n      inject: [ConfigService],\n      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({\n        ...configService.get('dbConnections.secret'),\n        entities: secretEntities,\n      }),\n    }),\n    GraphQLModule.forRootAsync({\n      // ...\n    }),\n    // other modules\n  ],\n  controllers: [],\n  providers: [],\n})\nexport class AppModule {}\n")),Object(i.b)("p",null,"Of course, there can only be one ",Object(i.b)("inlineCode",{parentName:"p"},"default")," database connection. All other connections ",Object(i.b)("strong",{parentName:"p"},"must")," have a proper ",Object(i.b)("inlineCode",{parentName:"p"},"name")," set up. Further, this name ",Object(i.b)("strong",{parentName:"p"},"must")," be used when connecting against this specific entity."),Object(i.b)("h2",{id:"create-a-new-feature-module"},"Create a new Feature Module"),Object(i.b)("p",null,"Second, you need to create a new module for the feature that should store its data in another database using the previously defined connection."),Object(i.b)("p",null,"First, define your ",Object(i.b)("inlineCode",{parentName:"p"},"Entity")," class that is stored within the database"),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts",metastring:'title="secret/secret.entity.ts"',title:'"secret/secret.entity.ts"'}),"import { Entity, Column } from 'typeorm';\n\n@Entity('secrets')\nexport class SecretEntity {\n  // some properties here, like\n  @Column()\n  name: string;\n}\n")),Object(i.b)("p",null,"and the corresponding ",Object(i.b)("inlineCode",{parentName:"p"},"ObjectType")," that is used for ",Object(i.b)("inlineCode",{parentName:"p"},"GraphQL")),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts",metastring:'title="secret/secret.dto.ts"',title:'"secret/secret.dto.ts"'}),"import { ObjectType, Field } from '@nestjs/graphql';\n\n@ObjectType('Secret')\nexport class SecretDTO {\n  @Field()\n  name: string;\n}\n")),Object(i.b)("p",null,"Now lets register the ",Object(i.b)("inlineCode",{parentName:"p"},"SecretEntity")," with ",Object(i.b)("inlineCode",{parentName:"p"},"NestjsQueryTypeOrmModule"),". "),Object(i.b)("p",null,"The only difference is you need to pass the name of the ",Object(i.b)("inlineCode",{parentName:"p"},"Connection")," when importing respective ",Object(i.b)("inlineCode",{parentName:"p"},"TypeOrmModule"),"."),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts",metastring:'title="secret/secret.module.ts"',title:'"secret/secret.module.ts"'}),"import { Module } from '@nestjs/common';\nimport { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';\nimport { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm'; \nimport { SECRET_DB_CONNECTION } from '../constants';\nimport { SecretEntity } from './secret.entity';\nimport { SecretDTO } from './secret.dto'\n\n@Module({\n  imports: [\n    NestjsQueryGraphQLModule.forFeature({\n      // import the NestjsQueryTypeOrmModule to register the entity with typeorm\n      // and provide a QueryService\n      imports: [\n        NestjsQueryTypeOrmModule.forFeature(\n          [SecretEntity], \n          SECRET_DB_CONNECTION, // specify the connection name\n        )\n      ],\n      // describe the resolvers you want to expose\n      resolvers: [{ DTOClass: SecretDTO, EntityClass: SecretEntity }],\n    }),\n    \n  ],  \n})\nexport class SecretModule {}\n")),Object(i.b)("p",null,"Now the ",Object(i.b)("inlineCode",{parentName:"p"},"NestjsQueryGraphQLModule")," will create a ",Object(i.b)("inlineCode",{parentName:"p"},"Resolver")," for the ",Object(i.b)("inlineCode",{parentName:"p"},"SecretDTO")," and ",Object(i.b)("inlineCode",{parentName:"p"},"SecretEntity")," that will use the custom connection."),Object(i.b)("h2",{id:"custom-typeormqueryservice"},"Custom TypeOrmQueryService"),Object(i.b)("p",null,"If you want to create a custom ",Object(i.b)("inlineCode",{parentName:"p"},"SecretService")," responsible for the database access, a custom ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"../services"}),"QueryService"),", you need to pass an additional argument to the ",Object(i.b)("inlineCode",{parentName:"p"},"@InjectRepository()")," decorator that indicates the ",Object(i.b)("inlineCode",{parentName:"p"},"Connection")," you are using. This string has to match the ",Object(i.b)("inlineCode",{parentName:"p"},"name")," property in the ",Object(i.b)("inlineCode",{parentName:"p"},"TypeOrmModule")," options!"),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-ts",metastring:'title="secret/secret.service.ts"',title:'"secret/secret.service.ts"'}),"import { QueryService } from '@nestjs-query/core';\nimport { TypeOrmQueryService } from '@nestjs-query/query-typeorm';\nimport { InjectRepository } from '@nestjs/typeorm';\nimport { Repository } from 'typeorm';\nimport { SECRET_DB_CONNECTION } from '../constants';\nimport { SecretEntity } from './secret.entity';\n\n@QueryService(SecretEntity)\nexport class SecretService extends TypeOrmQueryService<SecretEntity> {\n  constructor(\n    @InjectRepository(SecretEntity, SECRET_DB_CONNECTION) repository: Repository<SecretEntity>,\n  ) {\n    super(repository);\n  }\n}\n")),Object(i.b)("p",null,"For the sake of brevity, the ",Object(i.b)("inlineCode",{parentName:"p"},"AssemblerService")," is not covered here, as it should not directly interact with the database itself. Therefore, no further adaptations are required. This also applies to the ",Object(i.b)("inlineCode",{parentName:"p"},"Resolver"),"!"),Object(i.b)("p",null,"For a full example see the ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"https://github.com/doug-martin/nestjs-query/tree/master/examples/nest-graphql-typeorm-multidb"}),"examples"),"."))}l.isMDXComponent=!0},258:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return d}));var r=n(0),o=n.n(r);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=o.a.createContext({}),l=function(e){var t=o.a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},u=function(e){var t=l(e.components);return o.a.createElement(p.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},b=o.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,a=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),u=l(n),b=r,d=u["".concat(a,".").concat(b)]||u[b]||m[b]||i;return n?o.a.createElement(d,s(s({ref:t},p),{},{components:n})):o.a.createElement(d,s({ref:t},p))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,a=new Array(i);a[0]=b;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:r,a[1]=s;for(var p=2;p<i;p++)a[p]=n[p];return o.a.createElement.apply(null,a)}return o.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"}}]);