// TypeScript types for PhonePe payment integration

export interface RegistrationData {
    fullName: string;
    email: string;
    gender: string;
    mobileNumber: string;
    dateOfBirth: string;
    tshirtSize: string;
    bloodGroup: string;
    category: string;
    categoryId: string;
    price: number;
}

export interface Registration extends RegistrationData {
    id?: string;
    userId?: string;
    merchantOrderId: string;
    status: 'pending' | 'completed' | 'failed';
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface Transaction {
    id?: string;
    registrationId: string;
    merchantOrderId: string;
    phonepeOrderId?: string;
    amount: number;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'TIMEOUT';
    paymentMethod?: string;
    paymentState?: string;
    errorCode?: string;
    errorMessage?: string;
    callbackData?: any;
    createdAt: Date | string;
    updatedAt: Date | string;
    completedAt?: Date | string | null;
}

export interface PaymentInitiateResponse {
    success: boolean;
    data?: {
        checkoutUrl: string;
        merchantOrderId: string;
        registrationId: string;
    };
    error?: string;
}

export interface PaymentStatusResponse {
    success: boolean;
    data?: {
        status: string;
        registration: Registration;
        transaction: Transaction;
    };
    error?: string;
}

export interface PhonePeCallbackPayload {
    type: string;
    payload: {
        orderId: string;
        state: string;
        amount: number;
        paymentMethod?: string;
        errorCode?: string;
        errorMessage?: string;
        [key: string]: any;
    };
}
