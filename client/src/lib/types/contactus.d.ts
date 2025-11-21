declare type contactUs = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

declare type contactUsResponse = ApiResponse<contactUs>;
