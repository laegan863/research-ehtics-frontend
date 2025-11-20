<script lang="ts" setup>
    import axios from 'axios';
    const modal = reactive({
        showLoginModal: false,
        showRegisterModal: false,
    });

    const config = useRuntimeConfig();
    const loading = ref(false);

    interface ApiResponse {
        success: boolean;
        message: string;
    }

    const form = reactive({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const error = reactive({
        passwordMismatch: false,
        passwordMismatchMessage: 'Passwords do not match',
        error: false,
        errorMessage: '',
        errors: {} as Record<string, string[]>
    })

    const success = reactive({
        success: false,
        successMessage: '',
    })

    const handleLoginModal = () => {
        modal.showLoginModal = true;
    }

    const handleRegisterModal = () => {
        modal.showRegisterModal = true;
    }

    const setDefaultForm = () => {
        form.name = ''
        form.email = ''
        form.password = ''
        form.password_confirmation = ''
        error.error = false
        error.errorMessage = ''
        error.errors = {}
    }

    const handleSubmitForm = async() => {
        console.log("API Token inside function:", config.public.apiToken || config.apiToken);
        loading.value = true;
        error.error = false;
        error.errorMessage = '';
        error.errors = {};
        try {
            const response = await axios.get<ApiResponse>(`${config.public.baseURL}/users?email=${encodeURIComponent(form.email)}&password=${encodeURIComponent(form.password)}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${config.public.apiToken || config.apiToken}`
                }
            });

            if(response.data.success){
                error.error = false;
                error.errorMessage = '';
            }

            console.log("response", response.data);
        } catch (err: any) {
            error.error = true;
            error.errorMessage = err.response?.data?.message || 'An error occurred during login.';
            error.errors = err.response?.data?.errors || {};
            console.log("error response", err.response?.data);
        } finally {
            loading.value = false;
        }
    }

    const handleSubmitRegForm = async () => {
        loading.value = true;
        try {
            const response = await axios.post<ApiResponse>(`${config.public.baseURL}/users`,form, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${config.public.apiToken || config.apiToken}`
                }
            });
            console.log("response", response.data);
            if(response.data.success){
                error.error = false;
                error.errorMessage = '';
            }

            success.success = true;
            success.successMessage = 'Registration successful!';

            setTimeout(() => {
                handleClose();
            }, 2000);

        } catch (err: any) {
            error.error = true;
            error.errorMessage = err.response?.data?.message || 'An error occurred during registration.';
        } finally {
            loading.value = false;
        }
    }

    const handleClose = () => {
        success.success = false;
        success.successMessage = '';
        modal.showLoginModal = false;
        modal.showRegisterModal = false;
        setDefaultForm();
    }

    onMounted(() => {
        watchEffect(() => {
            if (form.password !== form.password_confirmation && modal.showRegisterModal) {
                error.passwordMismatch = true;
            } else {
                error.passwordMismatch = false;
            }
        });

        console.log("API Token:", config.public.apiToken || config.apiToken);
    })


</script>
<template>
    <div class="min-h-screen bg-white dark:bg-gray-900">
        <div class="max-w-full bg-blue-600 text-white py-10 shadow-md lg:rounded-b-[100px] md:rounded-b-0 sm:rounded-b-0">
            <div class="grid lg:grid-cols-4 md:grid-cols-1 sm:grid-cols-1 gap-4 max-w-7xl mx-auto px-6 lg:px-8">
                <div class="lg:col-span-3 md:col-span-4 sm:col-span-4 px-7">
                    <h1 class="text-4xl font-bold mb-2">Welcome to Our Application</h1>
                    <p class="text-sm">Please login or register to continue.</p>
                </div>
                <div class="lg:col-span-1">
                    <div class="text-center flex lg:flex-col md:flex-col sm:flex-row jusitfy-center items-center ">
                        <Button variant="danger" class="lg:w-60 md:w-60 sm:w-auto lg:mb-2 md:mb-2 sm:mb-0 w-full" @click="handleLoginModal">
                            <font-awesome-icon icon="lock"/> Login 
                        </Button>
                        <span class="mx-2"></span>
                        <Button variant="light" class="lg:w-60 md:w-60 sm:w-auto lg:mb-2 md:mb-2 sm:mb-0 w-full" @click="handleRegisterModal">
                            <font-awesome-icon icon="user"/> Register 
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>            
    
    <Modal v-model="modal.showLoginModal" size="lg" title="Login Page">
        <template #body>
            <form>
                <Alert :dismissible="true" v-if="error.error" :message="error.errorMessage" variant="danger" />
                <div class="my-2">
                    <FormInput v-model="form.email" label="Email" type="email" placeholder="Enter your email" />
                </div>
                <div class="my-2">
                    <FormInput v-model="form.password" label="Password" type="password" placeholder="Enter your password" />
                </div>
            </form>
        </template>
        <template #footer="{ close }">
            <Button type="button" variant="secondary" @click="close">Cancel</Button>
            <Button type="submit" variant="primary" :loading="loading" @click="handleSubmitForm">
                <font-awesome-icon icon="lock" /> Login
            </Button>
        </template>
    </Modal>
    <Modal v-model="modal.showRegisterModal" size="lg" title="Register Page">
        <template #body>
            <form>
                <Alert :dismissible="true" v-if="error.error" :message="error.errorMessage" variant="danger" />
                <Alert :dismissible="true" v-if="success.success" :message="success.successMessage" variant="success" />
                <div class="my-2">
                    <FormInput 
                        v-model="form.name" 
                        label="Complete Name" 
                        type="text" 
                        placeholder="Enter your name"
                        :error="error.errors.name ? error.errors.name[0] : ''"
                    />
                </div>
                <div class="my-2">
                    <FormInput 
                        v-model="form.email" 
                        label="Email" 
                        type="email" 
                        placeholder="Enter your email"
                        :error="error.errors.email ? error.errors.email[0] : ''"
                    />
                </div>
                <div class="my-2">
                    <FormInput 
                        v-model="form.password" 
                        label="Password" 
                        type="password" 
                        placeholder="Enter your password"
                        :error="error.errors.password ? error.errors.password[0] : ''"
                    />
                </div>
                <div class="my-2">
                    <FormInput 
                        v-model="form.password_confirmation" 
                        label="Confirm Password" 
                        type="password" 
                        placeholder="Enter your password"
                        :error="error.passwordMismatch ? 'Passwords do not match' : (error.errors.password_confirmation ? error.errors.password_confirmation[0] : '')"
                    />
                </div>
            </form>
        </template>
        <template #footer="{ close }">
            <Button type="button" variant="secondary" @click="handleClose">Cancel</Button>
            <Button type="submit" variant="primary" :loading="loading" @click="handleSubmitRegForm">
                <font-awesome-icon icon="lock" /> Register
            </Button>
        </template>
    </Modal>
</template>