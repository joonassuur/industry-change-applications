import { Test, TestingModule } from '@nestjs/testing';
import { IndustryChangeApplicationsService } from './industry-change-applications.service';
import { Repository } from 'typeorm';
import { CreateIndustryChangeApplicationDto } from '../dto/create-industry-change-application.dto';
import { IndustryChangeApplication } from '../dto/create-industry-change-application.dto';
import { Resident } from '../entities/resident.entity';
import { getRepositoryToken } from '@nestjs/typeorm';


describe('IndustryChangeApplicationsService', () => {
  beforeAll(async () => {
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = '5432';
    process.env.DB_USER = 'postgres';
    process.env.DB_PASSWORD = 'test';
    process.env.DB_NAME = 'postgres';

    const module: TestingModule = await Test.createTestingModule({
      providers: [IndustryChangeApplicationsService],
    }).compile();

    service = module.get<IndustryChangeApplicationsService>(IndustryChangeApplicationsService);
  });

  let service: IndustryChangeApplicationsService;
  let repositoryMock: Repository<IndustryChangeApplication>;
  let residentRepositoryMock: Repository<Resident>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IndustryChangeApplicationsService,
        {
          provide: getRepositoryToken(IndustryChangeApplication),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Resident),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<IndustryChangeApplicationsService>(IndustryChangeApplicationsService);
    repositoryMock = module.get<Repository<IndustryChangeApplication>>(getRepositoryToken(IndustryChangeApplication));
    residentRepositoryMock = module.get<Repository<Resident>>(getRepositoryToken(Resident));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create industry change application', async () => {
    const createDto: CreateIndustryChangeApplicationDto = {
      residentSub: '2',
      willWorkInPhysicalJurisdiction: true,
    };

    const expectedResult: Partial<IndustryChangeApplication> = {
      residentsub: 2,
      current: null,
      requested: {
        willWorkInPhysicalJurisdiction: true,
      },
      status: 'IN_REVIEW',
      objectstatus: 'CURRENT',
      id: 1,
      createdat: new Date('2024-03-06T07:34:28.526Z'),
    };

    jest.spyOn(residentRepositoryMock, 'findOne').mockResolvedValue({
      sub: 2,
      firstname: "John",
      lastname: "Doe",
      fullname: "John Doe",
      permitnumber: 12,
      permitnumberqrcode: null,
      dateofbirth: new Date("1989-12-31T22:00:00.000Z"),
      countryofbirth: "USA",
      email: "john.doe@example",
      citizenship: "USA",
      gender: "M",
      phonenumber: "123-456-7890",
      country: null,
      address: {
        "city": "NY",
        "state": "NY",
        "country": "USA",
        "zipCode": "12345",
        "streetAddress": "123 st. 4",
        "isVerifiedAddress": false
      },
      typeofregistration: "RESIDENCY",
      typeofregistrationsub: null,
      willworkinphysicaljurisdiction: true,
      regulatoryelection: null,
      regulatoryelectionsub: null,
      firstregistrationdate: new Date("2019-12-31T22:00:00.000Z"),
      firstregistrationpaymentdate: null,
      status: "ACTIVE",
      residencyenddate: null,
      profilepicture: null,
      nextsubscriptionpaymentdate: new Date("2020-12-31T22:00:00.000Z")
    });
    jest.spyOn(repositoryMock, 'save').mockResolvedValue(expectedResult as IndustryChangeApplication);

    const result = await service.createIndustryChangeApplication(createDto);

    expect(result).toMatchObject({
      ...expectedResult,
      createdat: expect.any(Date),
      id: expect.any(Number),
    });
  });
});
