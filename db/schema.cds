namespace myapp;

entity User {
    key userId: Integer;
    firstName: String;
    lastName: String;
    mobileNumber: Int64;
    gender: String;
    emailId: String;
    Password: String;
    failedCount: Integer @default: 0;
    accountStatus: String @default: 'Active';
}
