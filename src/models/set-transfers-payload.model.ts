import {Model, model, property} from '@loopback/repository';

@model()
export class SetTransfersPayload extends Model {

  constructor(data?: Partial<SetTransfersPayload>) {
    super(data);
  }

  @property({
    type: 'string',
    required: true,
  })
  sourceAccountName: string;

  @property({
    type: 'string',
    required: true,
  })
  destinationAccountName: string;
}

export interface SetTransfersPayloadRelations {
  // describe navigational properties here
}

export type SetTransfersPayloadWithRelations = SetTransfersPayload & SetTransfersPayloadRelations;
