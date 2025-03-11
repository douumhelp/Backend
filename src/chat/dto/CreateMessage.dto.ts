import { IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  senderId: string;

  @IsUUID()
  receiverId: string;

  @IsString()
  content: string;
}
