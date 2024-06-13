export interface Notification {
	_id?: string | null;
	notification?: string | null;
	notifyBy?: number | null;
	notifyTo?: number | null;
	url?: string | null;
	type?: string | null;
	isRead: 'yes' | 'no';
	status: 'active' | 'inactive' | 'deleted' | 'suspended';
	createdBy?: string | null;
	createdAt?: Date;
	updatedBy?: string | null;
	updatedAt?: Date;
	deletedBy?: string | null;
	deletedAt?: Date | null;
}

export interface AdminSettings {
	_id?: string | null;
	logo?: string | null;
	logoAltText?: string | null;
	favicon?: string | null;
	faviconAltText?: string | null;
	paymentGateway?: 'paypal' | 'stripe' | 'other' | null;
	paymentMode?: 'test' | 'live';
	stripeTestSecretKey?: string | null;
	stripeTestPublishKey?: string | null;
	stripeLiveSecretKey?: string | null;
	stripeLivePublishKey?: string | null;
	linkedinLink?: string | null;
	twitterLink?: string | null;
	instagramLink?: string | null;
	facebookLink?: string | null;
	websiteUrl?: string | null;
	status: 'active' | 'inactive' | 'deleted' | 'suspended';
	createdBy?: string | null;
	createdAt?: Date;
	updatedBy?: string | null;
	updatedAt?: Date;
	deletedBy?: string | null;
	deletedAt?: Date | null;
}

export interface Blog {
	_id?: string | null;
	authorId?: string | null;
	title?: string | null;
	slug?: string | null;
	description?: string | null;
	image?: string | null;
	imageAltText?: string | null;
	serviceId?: number | null;
	metaTitle?: string | null;
	metaDescription?: string | null;
	timeToRead?: string | null;
	type?: string | null;
	status: 'active' | 'inactive' | 'deleted' | 'suspended';
	createdBy?: string | null;
	updatedBy?: string | null;
	deletedBy?: string | null;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date | null;
}

export interface Author {
	_id?: string | null;
	name?: string | null;
	slug?: string | null;
	gender: 'male' | 'female' | 'other';
	profileImage?: string | null;
	designation?: string | null;
	description?: string | null;
	linkedin?: string | null;
	facebook?: string | null;
	twitter?: string | null;
	instagram?: string | null;
	status: 'active' | 'inactive' | 'deleted' | 'suspended';
	createdBy?: string | null;
	createdAt?: Date;
	updatedBy?: string | null;
	updatedAt?: Date;
	deletedBy?: string | null;
	deletedAt?: Date | null;
}
export interface Address {
	street?: string | null;
	building?: string | null;
	city?: string | null;
	zip?: string | null;
	state?: string | null;
	country?: string | null;
	lat?: string | null;
	long?: string | null;
}

export interface SocialLinks {
	twitter?: string | null;
	facebook?: string | null;
	linkedin?: string | null;
	instagram?: string | null;
	website?: string | null;
}

export interface DocumentImage {
	imageType?: string | null;
	imagePath?: string | null;
}

export interface MetaTags {
	metaTitle?: string | null;
	metaDescription?: string | null;
}

export interface User {
	find(arg0: (r: any) => boolean): unknown;
	_id?: string | null;
	firstName: string;
	fullName: string;
	lastName: string;
	email: string | null;
	role: 'superadmin' | 'admin' | 'guest' | 'staff' | 'user';
	roleId: any | null;
	hotelId: string | null;
	departmentId: string | null;
	loginTime: string | null;
	checkoutTime: string | null;
	checkInDate: string | null;
	checkOutDate: string | null;
	slug?: string | null;
	password?: string | null;
	isShowEmail: boolean;
	isEmailVerified: boolean;
	phoneNumber?: string | null;
	phone?: string | null;
	isShowPhoneNumber: boolean;
	isPhoneVerified: boolean;
	designation?: string | null;
	companyName?: string | null;
	passwordUpdatedAt?: Date | null;
	gender: 'male' | 'female' | 'other';
	profileImage?: string | null;
	dob?: Date | null;
	bio?: string | null;
	about?: string | null;
	age?: number | null;
	isApproved: boolean;
	otp?: number | null;
	profileViewCount: number;
	planId?: number | null;
	document?: DocumentImage[];
	address: Address;
	socialLinks: SocialLinks;
	metaTags: MetaTags;
	subscriptionExpiryDate?: Date | null;
	stripeCustomerId?: string | null;
	stickyNote?: string | null;
	timeZone?: string | null;
	paymentMethod?: string | null;
	lastSeen?: Date;
	isOnline: 'yes' | 'no';
	twoFactorAuth: 'enabled' | 'disabled';
	loginTypeGoogle?: string | null;
	loginType?: string | null;
	isReported: boolean;
	status: 'active' | 'inactive' | 'deleted' | 'suspended';
	createdBy?: string | null;
	createdAt?: Date | null;
	updatedBy?: string | null;
	updatedAt?: Date | null;
	deletedBy?: string | null;
	deletedAt?: Date | null;
	name: string;
	roomName: string;
	totalAmount: string;
	arrival: string;
	token: string;
	image: string;
}

export type Country = {
	id: number;
	country_name: string;
	slug: string;
	flag: string;
	currency: string;
	capital: string;
	status: 'active' | 'inactive';
	created_at: string;
	updated_at: string;
};

export type City = {
	id: string;
	city_name: string;
	country_name: string;
	country_id: string;
	status: string;
};

export type ErrorsLogs = {
	error_message: string;
	id: string;
	file_name: string;
	line_number: string;
};

export type PaginationMeta = {
	current_page: number;
	path: string;
	from: number;
	last_page: number;
	per_page: number;
	to: number;
	total: number;
};

export type File = {
	created_at: string;
	name: string;
	size: number;
	source: string;
	thumbnail: string;
	type: string;
	updated_at: string;
	uuid: string;
};

export type Roles = {
	_id: any;
	roleName: string;
	permissions: {
		dashboard: boolean;
		stays: boolean;
		properties: boolean;
		promotions: boolean;
		guest: boolean;
		staff: boolean;
		blogs: boolean;
		ratesAndAvailability: boolean;
		tickets: boolean;
		frontDesk: boolean;
		calendar: boolean;
		roles: boolean;
		[key: string]: boolean;
	};
	status: 'active' | 'inactive' | 'deleted' | 'suspended';
	createdBy?: string;
	updatedBy?: string;
	deletedBy?: string;
	created_at?: string;
	updated_at?: string;
	deleted_at?: string;
};

export type Hotel = {
	_id?: string | null;
	hotelName: string | null;
	slug: string | null;
	hotelImage: string | null;
	email: string | null;
	contactNumber: string | null;
	website: string | null;
	location: string | null;
	lat: number | null;
	long: number | null;
	numberOfEmployees: number | null;
	description: string | null;
	linkedIn: string | null;
	twitter: string | null;
	facebook: string | null;
	instagram: string | null;
	managerUserId: string | null;
	status: 'active' | 'inactive' | 'deleted' | 'suspended';
	createdBy: string | null;
	createdAt: Date;
	updatedBy: string | null;
	updatedAt: Date;
	deletedBy: string | null;
	deletedAt: Date;
};

export type RoomType = {
	_id?: string | null;
	roomType: string | null;
	status: 'active' | 'inactive' | 'deleted' | 'suspended';
	createdBy: string | null;
	createdAt: Date;
	updatedBy: string | null;
	updatedAt: Date;
	deletedBy: string | null;
	deletedAt: Date;
};

export type Amenities = {
	amenityNames: any;
	image: string;
	_id?: string | undefined;
	name: string | null;
	status: 'active' | 'inactive' | 'deleted' | 'suspended';
	createdBy: string | null;
	createdAt: Date;
	updatedBy: string | null;
	updatedAt: Date;
	deletedBy: string | null;
	deletedAt: Date;
};

export interface Image {
	imagePath: string | null;
	isPrimary: boolean;
	status: 'active' | 'inactive' | 'deleted';
}

export type Rooms = {
	checkInDate: string;
	checkOutDate: string;
	_id: string;
	hotelId: string | any;
	roomTypeId: string | null;
	roomName: string | null;
	roomTypeName: string | null;
	floor: number | null;
	location: string | null;
	description: string | null;
	images: Image[];
	bedType: string | null;
	amenityNames: string[];
	amenities: string[]; // You may need to adjust this based on your use case
	status: 'available' | 'booked' | 'maintenance' | 'reserved';
	createdBy: string | null;
	createdAt: Date;
	updatedBy: string | null;
	updatedAt: Date;
	deletedBy: string | null;
	deletedAt: Date;
};

export type HotelManager = {
	fullName: string;
	_id: string;
};
export type HotelDetails = {
	hotelName?: string;
	email?: string;
	contactNumber?: string;
	location?: string;
};
export type Department = {
	_id: string;
	departmentName: string;
	status: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
	deletedBy: string;
	deletedAt: string;
	__v: number;
};

export interface Contact {
	_id?: string | null;
	name?: string | null;
	email?: string | null;
	address?: string | null;
	phone?: string | null;
	topic?: string | null;
	description?: string | null;
	status: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
	deletedBy: string;
	deletedAt: string;
}

export interface Deal {
	_id?: string;
	dealName?: string | null;
	startDate?: string | null;
	endDate?: string | null;
	promoCode?: string | null;
	daysOfWeek?: {
		sunday?: boolean;
		monday?: boolean;
		tuesday?: boolean;
		wednesday?: boolean;
		thursday?: boolean;
		friday?: boolean;
		saturday?: boolean;
	} | null;
	roomTypeId: {
		_id: string;
		roomType: string;
	};
	minLOS?: number | null;
	maxLOS?: number | null;
	cutOff?: number | null;
	lastMinuteBooking?: number | null;
	closeToArrival?: boolean | null;
	closeToDeparture?: boolean | null;
	discountType?: string | null;
	discountValue?: number | null;
	description?: string | null;
	status: string;
	createdBy: string;
	createdAt: string;
	updatedBy: string;
	updatedAt: string;
	deletedBy: string;
	deletedAt: string;
}
