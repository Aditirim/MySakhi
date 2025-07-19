// src/type.ts
export type QRDetailsType = {
  driverName: string;
  vehicleNumber: string;
  policeVerified: boolean;
  isSafeVotes: number;
  notSafeVotes: number;
};

export type RootStackParamList = {
  Scanner: undefined;
  VehicleDetail: { data: QRDetailsType };
};
