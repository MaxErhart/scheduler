export interface Event {
	id: number,
	startDate: Date,
	endDate: Date,
	pageID: number,
	owner: string,
	title: string,
	description: string,
	color: {background: string, text: string},
	weekly: boolean,
}
