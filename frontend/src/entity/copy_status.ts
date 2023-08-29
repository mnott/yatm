// @generated by protobuf-ts 2.8.2
// @generated from protobuf file "copy_status.proto" (package "copy_status", syntax proto3)
// tslint:disable
/**
 * @generated from protobuf enum copy_status.CopyStatus
 */
export enum CopyStatus {
    /**
     * @generated from protobuf enum value: DRAFT = 0;
     */
    DRAFT = 0,
    /**
     * waiting in queue
     *
     * @generated from protobuf enum value: PENDING = 1;
     */
    PENDING = 1,
    /**
     * @generated from protobuf enum value: RUNNING = 2;
     */
    RUNNING = 2,
    /**
     * @generated from protobuf enum value: STAGED = 3;
     */
    STAGED = 3,
    /**
     * @generated from protobuf enum value: SUBMITED = 4;
     */
    SUBMITED = 4,
    /**
     * @generated from protobuf enum value: FAILED = 255;
     */
    FAILED = 255
}
