import { Controller } from '@nestjs/common';
import { LoginActivitiesService } from './login-activities.service';

@Controller('login-activities')
export class LoginActivitiesController {
  constructor(private readonly loginActivitiesService: LoginActivitiesService) {}
}
