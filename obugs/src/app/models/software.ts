export interface Software {
  id: string;
  fullname: string;
  editor: string;
}

export interface SoftwareArrayPayload {
  payload: Software[];
}

export interface SoftwarePayload {
  payload: Software;
}
