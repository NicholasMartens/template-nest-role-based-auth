import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ERole } from '../auth/enums/role.enum';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  role: ERole;
}
