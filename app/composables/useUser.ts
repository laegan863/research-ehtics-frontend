export const useUser = () => {
    type UserCookie = {
        name: string;
        email: string;
        role: string;
    } | null;
    
    type User = {
        name: string;
        role: string;
        email: string;
        status: string;
        avatar: string;
    };
    
  const user = ref<User>([] as unknown as User);
  const userCookie = useCookie<UserCookie>('user').value;
  if( userCookie ) {
    user.value = {
      name: userCookie.name,
      role: userCookie.role,
      email: userCookie.email,
      status: 'online',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    }
  }

  const isOnline = computed(() => user.value.status === 'online')
  return {
    user: readonly(user),
    isOnline
  }

}