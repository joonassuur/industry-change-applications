enum TypeOfRegistration {
    RESIDENCY = 'RESIDENCY',
    E_RESIDENCY = 'E_RESIDENCY',
    LIMITED_E_RESIDENCY = 'LIMITED_E_RESIDENCY',
}

enum ResidentStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

enum ApplicationStatus {
    IN_REVIEW = 'IN_REVIEW',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

enum ObjectStatus {
    CURRENT = 'CURRENT',
    DELETED = 'DELETED',
}

export {
    TypeOfRegistration,
    ResidentStatus,
    ApplicationStatus,
    ObjectStatus,
}