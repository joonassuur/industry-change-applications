export class CreateIndustryChangeApplicationDto {
    residentSub: string;
    willWorkInPhysicalJurisdiction: boolean;
}

export class IndustryChangeApplication {
    id: number;
    residentsub: number;
    current: {
        willWorkInPhysicalJurisdiction: boolean;
    };
    requested: {
        willWorkInPhysicalJurisdiction: boolean;
    };
    status: string;
    submittedat: Date;
    decision: null;
    createdby: string;
    objectstatus: string;
    createdat: Date;
}