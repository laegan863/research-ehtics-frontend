export default async function useLogout() {
    const { data } = await useFetch('/api/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    console.log("Logout message:", data.value?.message);
}