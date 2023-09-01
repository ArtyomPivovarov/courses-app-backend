import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class Language {
  @PrimaryColumn({ length: 2, name: 'language_code' })
  code: string

  @Column({ length: 30 })
  name: string
}
