export interface Payment {
	url: string;
	params: {
		MerchantLogin: string;
		OutSum: string;
		Description: string;
		SignatureValue: string;
		InvId: string;
		Encoding: string;
		Receipt: string;
		IsTest?: '0' | '1';
	};
}
