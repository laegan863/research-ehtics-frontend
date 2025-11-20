<script lang="ts" setup>
    import Swal from 'sweetalert2';
    import axios from 'axios';
    const config = useRuntimeConfig();

    interface User {
        id: string;
        name: string;
        email: string;
        email_verified_at: string | null;
        remember_token: string | null;
        created_at: string;
        updated_at: string;
        is_active: boolean;
    }

    interface ApiResponse {
        data: User[];
        success: boolean;
    }

    const loading = reactive({
        gatherUsersLoading: false,
    })

    const error = reactive({
        gatherUsersError: null as Error | null,
        errorMessage: null as string | null,
    })

    const users = ref<ApiResponse>([] as any);
    const gatherUsers = async () => {
        try {
            loading.gatherUsersLoading = true;
            const response = await axios.get<ApiResponse>(`${config.public.baseURL}/users`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${config.public.apiToken || config.apiToken}`
                }
            });
            if(response.data.success){
                users.value = response.data;
                console.log("Users data", users.value);
            }
        } catch (err) {
            error.gatherUsersError = err as Error;
            error.errorMessage = error.gatherUsersError.message;
            console.error("Error gathering users:", error);
        } finally {
            loading.gatherUsersLoading = false;
        }
    }

    onMounted(() => {
        gatherUsers();
        console.log("Mounted users page: ", config.public.baseURL);
    });

    const handleActionGeneral = async (userId: any, status: boolean) => {
        try {
            useDeleteLoading("Updating", "Updating user status, please wait...");
            const response = await axios.put(`${config.public.baseURL}/users/${userId}`, {
                status: status
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${config.public.apiToken || config.apiToken}`
                }
            });
            if(response.data.success){
                const userIndex = users.value.data.findIndex((u: User) => u.id === userId);
                if (userIndex !== -1 && users.value.data[userIndex]) {
                    users.value.data[userIndex].is_active = status;
                }
            }
        } catch (e) {
            console.error('Error updating user status:', e);
        } finally {
            Swal.close();
        }
    }

    const handleAction = (value: string | number, userId: string) => {
        switch (value) {
            case 'approve':
                handleActionGeneral(userId, true);
                break;
            case 'deactivate':
                handleActionGeneral(userId, false);
                break;
            default:
                break;
        }
    }
    
</script>
<template>
    <CardContainer>
        <div v-if="loading.gatherUsersLoading">
            <Loading/>
        </div>
        <Table v-if="!loading.gatherUsersLoading && users && users.data"
                :data="users.data"
                :searchable-fields="['name', 'email']"
                :striped="true"
                :hoverable="true"
                :searchable="true"
                :paginated="true"
            >
                <template #thead>
                    <tr>
                        <TableTh align="center"></TableTh>
                        <TableTh>ID</TableTh>
                        <TableTh>Name</TableTh>
                        <TableTh>Email</TableTh>
                        <TableTh align="center">Verified</TableTh>
                        <TableTh align="center">Created At</TableTh>
                    </tr>
                </template>
                <template #tbody="{ paginatedData }">
                    <tr v-for="(user, index) in paginatedData">
                        <TableTd align="center">
                            <Dropdown
                                :options="user.is_active ? [
                                    { value: 'deactivate', label: 'Deactivate', danger: true },
                                ] : [
                                    { value: 'approve', label: 'Approve' },
                                    { value: 'archive', label: 'Archive', danger: true }
                                ]"
                                @select="handleAction($event, user.id)"
                            >
                                <template #trigger>
                                    <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                                        </svg>
                                    </button>
                                </template>
                            </Dropdown>
                        </TableTd>
                        <TableTd>
                            <span class="font-medium">#{{ index + 1 }}</span>
                        </TableTd>
                        <TableTd>
                                <div class="font-medium">{{ user.name }}</div>
                        </TableTd>
                        <TableTd>
                            <span class="text-gray-600 dark:text-gray-400">{{ user.email }}</span>
                        </TableTd>
                        <TableTd align="center">
                            <span :class="user.is_active ? 'bg-green-500' : 'bg-red-500'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white">
                                {{ user.is_active ? 'Active' : 'Inactive' }}
                            </span>
                        </TableTd>
                        <TableTd align="center">
                            {{ new Date(user.created_at).toLocaleDateString() }}
                        </TableTd>
                    </tr>
                    <tr v-if="!loading.gatherUsersLoading && paginatedData.length === 0">
                        <TableTd align="center" class="!py-12 text-gray-500 dark:text-gray-400" colspan="6">
                            No results found. Try adjusting your search.
                        </TableTd>
                    </tr>
                </template>
            </Table>
    </CardContainer>
</template>