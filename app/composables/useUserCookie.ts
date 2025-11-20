export default function useUserCookie(){
    type UserCookie = {
        id: number;
        name: string;
        email: string;
        role: string;
        status: string;
        avatar: string;
    } | null;
    const userCookie = useCookie<UserCookie>('user').value;
    return userCookie;
}