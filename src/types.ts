import { 
  ModuleFlatObjectNamed, 
  ModuleFlatObjects,
  type EditPost
} from '@divi/types';

export type ModuleFlatObjectItems = (
  ModuleFlatObjectNamed<'cg/child-module'> |
  ModuleFlatObjectNamed<'cg/d4-module'> |
  ModuleFlatObjectNamed<'cg/dynamic-module'> |
  ModuleFlatObjectNamed<'cg/parent-module'> |
  ModuleFlatObjectNamed<'cg/static-module'>
);

export type ExampleModuleFlatObjects = ModuleFlatObjects<ModuleFlatObjectItems>;

export type ExampleMutableEditPostStoreState = EditPost.Store.State<ExampleModuleFlatObjects>;

export type ExampleEditPostStoreState = EditPost.Store.ImmutableState<ExampleModuleFlatObjects>;