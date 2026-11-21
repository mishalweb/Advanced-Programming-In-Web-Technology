
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('books')
export class Books {
  @PrimaryColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  author_name: string;

  @Column({
    type: 'int',
  })
  pages: number;
}
