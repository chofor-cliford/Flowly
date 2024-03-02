
export interface IImage extends Document {
  _id: string;
  title: string;
  transformationType: string;
  clerkId: string;
  publicId: string;
  secureURL: string;
  width?: number;
  height?: number;
  config?: object;
  transformationUrl?: string;
  aspectRatio?: string;
  color?: string;
  prompt?: string;
  author: {
    clerkId: string | null | undefined;
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends Document {
  _id: string;
  email: string;
  username: string;
  photo: string;
  firstName: string;
  lastName: string;
  creditBalance: number;
}

/* eslint-disable no-unused-vars */

// ====== USER PARAMS
export declare type CreateUserParams = {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
};

export declare type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
};

// ====== IMAGE PARAMS
export declare type AddImageParams = {
  image: {
    title: string;
    publicId: string;
    transformationType: string;
    width: number;
    height: number;
    config: any;
    secureURL: string;
    transformationURL: string;
    aspectRatio: string | undefined;
    prompt: string | undefined;
    color: string | undefined;
  };
  userId: string;
  path: string;
};

export declare type UpdateImageParams = {
  image: {
    _id: string;
    title: string;
    publicId: string;
    transformationType: string;
    width: number;
    height: number;
    config: any;
    secureURL: string;
    transformationURL: string;
    aspectRatio: string | undefined;
    prompt: string | undefined;
    color: string | undefined;
  };
  userId: string;
  path: string;
};

export declare type Transformations = {
  restore?: boolean;
  fillBackground?: boolean;
  remove?: {
    prompt: string;
    removeShadow?: boolean;
    multiple?: boolean;
  };
  recolor?: {
    prompt?: string;
    to: string;
    multiple?: boolean;
  };
  removeBackground?: boolean;
};

// ====== TRANSACTION PARAMS
export declare type CheckoutTransactionParams = {
  plan: string;
  credits: number;
  amount: number;
  buyerId: string;
};

export declare type CreateTransactionParams = {
  stripeId: string;
  amount: number;
  credits: number;
  plan: string;
  buyerId: string;
  createdAt: Date;
};

export declare type TransformationTypeKey =
  | "restore"
  | "fill"
  | "remove"
  | "recolor"
  | "removeBackground";

// ====== URL QUERY PARAMS
export declare type FormUrlQueryParams = {
  searchParams: string;
  key: string;
  value: string | number | null;
};

export declare type UrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};

export declare type RemoveUrlQueryParams = {
  searchParams: string;
  keysToRemove: string[];
};

export declare type SearchParamProps = {
  params: { id: string; type: TransformationTypeKey };
  searchParams: { [key: string]: string | string[] | undefined };
};

export declare type TransformationFormProps = {
  action: "Add" | "Update";
  userId: string;
  type: TransformationTypeKey;
  creditBalance: number;
  data?: IImage | null;
  config?: Transformations | null;
};

export declare type TransformedImageProps = {
  image: any;
  type: string;
  title: string;
  url?: string;
  transformationConfig: Transformations | null;
  isTransforming: boolean;
  hasDownload?: boolean;
  setIsTransforming?: React.Dispatch<React.SetStateAction<boolean>>;
};