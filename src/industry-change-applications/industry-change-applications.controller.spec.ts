import { Test, TestingModule } from '@nestjs/testing';
import { IndustryChangeApplicationsController } from './industry-change-applications.controller';
import { IndustryChangeApplicationsService } from './industry-change-applications.service';
import { CreateIndustryChangeApplicationDto, IndustryChangeApplication } from '../dto/create-industry-change-application.dto';

describe('IndustryChangeApplicationsController', () => {
  let controller: IndustryChangeApplicationsController;
  let service: IndustryChangeApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IndustryChangeApplicationsController],
      providers: [IndustryChangeApplicationsService],
    }).compile();

    controller = module.get<IndustryChangeApplicationsController>(IndustryChangeApplicationsController);
    service = module.get<IndustryChangeApplicationsService>(IndustryChangeApplicationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create industry change application', async () => {
    const createDto: CreateIndustryChangeApplicationDto = {
      residentSub: '1',
      willWorkInPhysicalJurisdiction: true,
    };

    const expectedResult: IndustryChangeApplication = {
      id: 1,
      residentsub: 1,
      current: null,
      requested: {
        willWorkInPhysicalJurisdiction: true,
      },
      status: 'IN_REVIEW',
      submittedat: new Date(),
      decision: null,
      createdby: 'testUser',
      objectstatus: 'CURRENT',
      createdat: new Date(),
    };

    jest.spyOn(service, 'createIndustryChangeApplication').mockResolvedValue(expectedResult);

    const result = await controller.createIndustryChangeApplication(createDto);

    expect(result).toEqual(expectedResult);
  });
});
