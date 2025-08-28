package model

type IncidentType string
const (
	FIRE IncidentType = "FIRE"
	ELECTRICAL IncidentType = "ELECTRICAL"
	HAZMAT IncidentType = "HAZMAT"
)

func IsValidType(t string) bool {
	switch IncidentType(t){
	case FIRE, ELECTRICAL, HAZMAT:
		return true
	default:
		return false
	}
}

type Location struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type Incident struct {
	ID           string       `json:"id"`
	Title        string       `json:"title"`
	Description  string       `json:"description,omitempty"`
	IncidentType IncidentType `json:"incident_type"`
	Location     *Location    `json:"location,omitempty"`
	ImageURL     string       `json:"imageUrl,omitempty"`
	CreatedAt    string       `json:"createdAt"`
}