import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from '../models/User';
import { mockUsers } from 'src/_mocks_/mockUsers';
import { UserSetting } from '../models/UserSetting';
import { mockUserSettings } from 'src/_mocks_/mockUserSettings';
import { CreateUserInput } from '../utils/CreateUserInput';

export let incrementalId = 3;

// populate your fields with the correct data
@Resolver((of) => User)
export class UserResolver {
  @Query((returns) => User, { nullable: true })
  getUserById(@Args('id', { type: () => Int }) id: number) {
    return mockUsers.find((user) => user.id === id);
  }

  @Query(() => [User])
  getUsers() {
    return mockUsers;
  }

  // resolve is good for nosql databaes with no direct connection but on sql, just use builtin functions (typeorm, etc)
  @ResolveField((returns) => UserSetting, { name: 'settings', nullable: true })
  getUserSettings(@Parent() user: User) {
    return mockUserSettings.find((setting) => setting.userId === user.id);
  }

  @Mutation((returns) => User)
  createUser(@Args('createUserData') createUserData: CreateUserInput) {
    const { username, displayName } = createUserData;
    const newUser = { username, displayName, id: ++incrementalId };
    mockUsers.push(newUser);
    return newUser;
  }
}
