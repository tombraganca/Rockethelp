import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
//Data Transference Types

export type OrderFirestoreDTO = {
    patrimony: string;
    description: string;
    status: 'open' | 'closed';
    solution?: string;
    create_at: FirebaseFirestoreTypes.Timestamp;
    closed_at: FirebaseFirestoreTypes.Timestamp;
}