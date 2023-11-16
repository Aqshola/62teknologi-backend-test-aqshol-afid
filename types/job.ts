export type JOB = {
  id: string;
  type: string;
  url: string;
  created_at: string;
  company: string;
  company_url: string;
  location: string;
  title: string;
  description: string;
  how_to_apply: string;
  company_logo: string;
};

export type JOB_QUERY = {
  page?: number;
  description?: string;
  location?: string;
  fulltime?: boolean;
};

export type JOB_PARAMS = {
  jobId: string;
};
