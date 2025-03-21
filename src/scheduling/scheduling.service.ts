import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scheduling } from './scheduling.entity';
import { UserPJ } from '../userpj/userpj.entity';

@Injectable()
export class SchedulingService {
  constructor(
    @InjectRepository(Scheduling)
    private schedulingRepository: Repository<Scheduling>,
    @InjectRepository(UserPJ)
    private userPJRepository: Repository<UserPJ>,
  ) {}

  async getAvailableTimes(userPJId: string): Promise<Date[]> {
    const scheduledTimes = await this.schedulingRepository.find({
      where: { userPJ: { id: userPJId } },
      select: ['startTime'],
    });
  
    console.log("[DEBUG] Horários agendados no banco:", scheduledTimes);
  
    const scheduledTimestamps = new Set(scheduledTimes.map((s) => s.startTime.getTime()));
  
    const availableTimes: Date[] = [];
  
    for (let hour = 0; hour < 24; hour++) {
      const timeSlot = new Date();
      timeSlot.setHours(hour, 0, 0, 0);
  
      if (!scheduledTimestamps.has(timeSlot.getTime())) {
        availableTimes.push(timeSlot);
      }
    }
  
    return availableTimes;
  }
  
  async initializeSchedule(userPJId: string) {
    const userPJ = await this.userPJRepository.findOne({ where: { id: userPJId } });
    if (!userPJ) throw new NotFoundException('User PJ not found');
  
    const schedules: Scheduling[] = []; 
  
    for (let hour = 0; hour < 24; hour++) {
      const timeSlot = new Scheduling();
      timeSlot.startTime = new Date();
      timeSlot.startTime.setHours(hour, 0, 0, 0);
      timeSlot.userPJ = userPJ;
      schedules.push(timeSlot);
    }
  
    await this.schedulingRepository.save(schedules);
    return schedules;
  }
  
  async isTimeAvailable(userPJId: string, startTime: Date): Promise<boolean> {
    const existingSchedule = await this.schedulingRepository.findOne({
      where: { userPJ: { id: userPJId }, startTime },
    });
  
    return !existingSchedule; 
  }

  async addScheduledTime(userPJId: string, startTime: Date) {
    const userPJ = await this.userPJRepository.findOne({ where: { id: userPJId } });
    if (!userPJ) throw new NotFoundException('User PJ not found');

    const scheduling = this.schedulingRepository.create({
      startTime,
      userPJ,
    });

    return this.schedulingRepository.save(scheduling);
  }

  async bookTimeSlot(userPJId: string, startTime: Date) {
    console.log(`[DEBUG] Tentando agendar horário para o PJ: ${userPJId}, Horário: ${startTime.toISOString()}`);
  
    const existingSchedule = await this.schedulingRepository.findOne({
      where: { userPJ: { id: userPJId }, startTime },
    });
  
    if (existingSchedule) {
      console.error("[ERRO] Horário já está agendado:", existingSchedule);
      throw new Error("Time slot already booked");
    }
  
    const userPJ = await this.userPJRepository.findOne({ where: { id: userPJId } });
    if (!userPJ) throw new NotFoundException("User PJ not found");
  
    const scheduling = this.schedulingRepository.create({
      startTime,
      userPJ,
    });
  
    console.log("[DEBUG] Salvando novo agendamento:", scheduling);
  
    await this.schedulingRepository.save(scheduling);
  
    console.log("[DEBUG] Agendamento salvo com sucesso!");
  }
}
