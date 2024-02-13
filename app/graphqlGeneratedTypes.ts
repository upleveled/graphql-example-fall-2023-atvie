export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Animal = {
  __typename?: 'Animal';
  accessory?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  type: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAnimal?: Maybe<Animal>;
  deleteAnimal?: Maybe<Animal>;
  login?: Maybe<User>;
  updateAnimal?: Maybe<Animal>;
};


export type MutationCreateAnimalArgs = {
  accessory?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  type: Scalars['String']['input'];
};


export type MutationDeleteAnimalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationUpdateAnimalArgs = {
  accessory?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  type: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  animal?: Maybe<Animal>;
  animals?: Maybe<Array<Maybe<Animal>>>;
};


export type QueryAnimalArgs = {
  id: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  username?: Maybe<Scalars['String']['output']>;
};

export type LoginMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'User', id: string, username?: string | null } | null };

export type CreateAnimalMutationVariables = Exact<{
  firstName: Scalars['String']['input'];
  type: Scalars['String']['input'];
  accessory?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateAnimalMutation = { __typename?: 'Mutation', createAnimal?: { __typename?: 'Animal', id: string, firstName: string, type: string, accessory?: string | null } | null };

export type AnimalsQueryVariables = Exact<{ [key: string]: never; }>;


export type AnimalsQuery = { __typename?: 'Query', animals?: Array<{ __typename?: 'Animal', id: string, firstName: string, type: string, accessory?: string | null } | null> | null };

export type UpdateAnimalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  firstName: Scalars['String']['input'];
  type: Scalars['String']['input'];
  accessory?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateAnimalMutation = { __typename?: 'Mutation', updateAnimal?: { __typename?: 'Animal', id: string, firstName: string, type: string, accessory?: string | null } | null };

export type DeleteAnimalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAnimalMutation = { __typename?: 'Mutation', deleteAnimal?: { __typename?: 'Animal', id: string } | null };
