package storage

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sync"

	"github.com/LucatonyRaudales/blazestack-fire-incident/incident/model"
)

type Store struct {
	mu       sync.RWMutex
	items    []model.Incident
	jsonPath string
	persist  bool
}

func NewStore(jsonPath string, persist bool) *Store {
	s := &Store{jsonPath: jsonPath, persist: persist}
	if persist {
		_ = os.MkdirAll(filepath.Dir(jsonPath), 0755)
		s.load()
	}
	return s
}

func (s *Store) load() {
	if b, err := os.ReadFile(s.jsonPath); err == nil {
		var arr []model.Incident
		if json.Unmarshal(b, &arr) == nil {
			s.items = arr
		}
	}
}

func (s *Store) save() {
	if !s.persist {
		return
	}
	b, _ := json.MarshalIndent(s.items, "", "  ")
	_ = os.WriteFile(s.jsonPath, b, 0644)
}

func (s *Store) Add(i model.Incident) {
	s.mu.Lock()
	defer s.mu.Unlock()
	// reverse chronological: prepend (unshift)
	s.items = append([]model.Incident{i}, s.items...)
	s.save()
}

func (s *Store) List() []model.Incident {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]model.Incident, len(s.items))
	copy(out, s.items)
	return out
}
