import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnnee, setSelectedAnnee] = useState('1'); 
  const [selectedSemestre, setSelectedSemestre] = useState('all');
  const [allEtudiants, setAllEtudiants] = useState([]); 
  const [suggestions, setSuggestions] = useState([]);
  const [palmares, setPalmares] = useState(null);
  const [currentMatricule, setCurrentMatricule] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllEtudiants = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/etudiants');
        setAllEtudiants(response.data);
      } catch (err) {
        console.error("Erreur lors du pré-chargement des étudiants:", err);
      }
    };
    fetchAllEtudiants();
  }, []);

  useEffect(() => {
    if (currentMatricule) {
      loadPalmares(currentMatricule, selectedAnnee);
    }
  }, [selectedAnnee]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === '') {
      setSuggestions([]);
      return;
    }

    const filtered = allEtudiants.filter((etudiant) => {
      const nomComplet = `${etudiant.prenom} ${etudiant.nom}`.toLowerCase();
      const matricule = etudiant.matriculeUnique.toLowerCase();
      const cherche = value.toLowerCase();
      return nomComplet.includes(cherche) || matricule.includes(cherche);
    });

    setSuggestions(filtered);
  };

  const handleSelectEtudiant = (etudiant) => {
    setSearchQuery(`${etudiant.prenom} ${etudiant.nom}`);
    setSuggestions([]); 
    setCurrentMatricule(etudiant.matriculeUnique);
    loadPalmares(etudiant.matriculeUnique, selectedAnnee);
  };

  const loadPalmares = async (matricule, anneeId) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:8080/api/etudiants/${matricule}/palmares/${anneeId}`);
      setPalmares(response.data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger le relevé de notes pour cette année.");
      setPalmares(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelectEtudiant(suggestions[0]);
    } else if (searchQuery.trim()) {
      axios.get(`http://localhost:8080/api/etudiants/recherche?query=${searchQuery}`)
        .then(res => {
          if (res.data.length > 0) handleSelectEtudiant(res.data[0]);
          else setError("Aucun étudiant trouvé.");
        });
    }
  };

  const getFilteredResultats = () => {
    if (!palmares?.etudiant?.resultats) return [];
    return palmares.etudiant.resultats.filter((res) => {
      if (selectedSemestre === 'all') return true;
      return String(res.semestre?.id) === selectedSemestre;
    });
  };

  const getDynamicPromotion = () => {
    if (!palmares?.etudiant?.resultats || palmares.etudiant.resultats.length === 0) return "Aucune promotion";
    return palmares.etudiant.resultats[0].promotion?.nom || "Non définie";
  };

  const getAnneeLabel = () => {
    if (palmares?.etudiant?.resultats?.[0]?.anneeAcademique?.libelle) {
      return palmares.etudiant.resultats[0].anneeAcademique.libelle;
    }
    const backupLabels = { '1': '2023-2024', '2': '2024-2025', '3': '2025-2026' };
    return backupLabels[selectedAnnee] || `Année ${selectedAnnee}`;
  };

  const getMentionBadge = (mention) => {
    if (!mention) return <span className="bg-slate-800 text-slate-400 border border-slate-700/50 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide">Sans mention</span>;
    if (mention.includes('Excellent') || mention.includes('Grande') || mention.includes('Distinction')) {
      return <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-5 py-2 rounded-xl text-xs font-bold tracking-wide shadow-[0_0_15px_rgba(99,102,241,0.1)]">✨ {mention}</span>;
    }
    return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-5 py-2 rounded-xl text-xs font-bold tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.1)]">🔹 {mention}</span>;
  };

  const filteredResultats = getFilteredResultats();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* HEADER PREMIUM */}
      <header className="bg-slate-900/60 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-4 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-5">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3.5 self-start lg:self-center">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 text-white p-2.5 rounded-2xl shadow-[0_4px_20px_rgba(99,102,241,0.3)] text-xl">
              🎓
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">CURSUS CORE</h1>
              <p className="text-[10px] text-indigo-400 font-extrabold tracking-widest uppercase">Palmarès & Suivi Académique</p>
            </div>
          </div>

          {/* Formulaire & Filtres Responsives */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-stretch gap-3 w-full lg:w-auto relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:flex md:items-center">
              
              {/* Select Année */}
              <div className="relative">
                <select
                  value={selectedAnnee}
                  onChange={(e) => setSelectedAnnee(e.target.value)}
                  className="appearance-none w-full md:w-56 pl-4 pr-10 py-2.5 rounded-xl bg-slate-900 text-xs font-bold border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer shadow-inner"
                >
                  <option value="1">Année Académique 2023-2024</option>
                  <option value="2">Année Académique 2024-2025</option>
                  <option value="3">Année Académique 2025-2026</option>
                </select>
                <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-500 text-[9px]">▼</div>
              </div>

              {/* Select Semestre */}
              <div className="relative">
                <select
                  value={selectedSemestre}
                  onChange={(e) => setSelectedSemestre(e.target.value)}
                  className="appearance-none w-full md:w-48 pl-4 pr-10 py-2.5 rounded-xl bg-slate-900 text-xs font-bold border border-slate-800 text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer shadow-inner"
                >
                  <option value="all">Tous les Semestres</option>
                  <option value="1">Premier Semestre</option>
                  <option value="2">Second Semestre</option>
                </select>
                <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-500 text-[9px]">▼</div>
              </div>
            </div>

            {/* Input Recherche de l'étudiant */}
            <div className="relative flex-1 md:w-72">
              <input
                type="text"
                placeholder="Nom ou Matricule de l'étudiant..."
                value={searchQuery}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 text-xs font-semibold border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                required
              />
              
              {/* Menu Suggestion Flottant Dark */}
              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] max-h-60 overflow-y-auto z-50 divide-y divide-slate-800/60 custom-scrollbar">
                  {suggestions.map((etudiant) => (
                    <div
                      key={etudiant.id}
                      onClick={() => handleSelectEtudiant(etudiant)}
                      className="px-4 py-3 text-xs hover:bg-slate-800/80 cursor-pointer flex justify-between items-center transition-all"
                    >
                      <div>
                        <span className="font-bold text-slate-200 block">{etudiant.prenom} {etudiant.nom}</span>
                        <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{etudiant.matriculeUnique}</span>
                      </div>
                      <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider">Sélectionner</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold px-6 py-2.5 md:py-2 rounded-xl transition-all shadow-[0_4px_15px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)] active:scale-98 cursor-pointer whitespace-nowrap text-center"
            >
              Analyser
            </button>
          </form>
        </div>
      </header>

      {/* ZONE PRINCIPALE DE L'APPLICATION */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500 font-bold tracking-wider uppercase animate-pulse">Extraction des métriques...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-xs font-semibold shadow-2xl mb-8 max-w-md mx-auto flex items-center gap-3">
            <span className="text-base">⚠️</span> {error}
          </div>
        )}

        {!palmares && !error && !loading && (
          <div className="text-center py-16 sm:py-24 bg-slate-900/40 rounded-3xl border border-slate-900 p-6 sm:p-10 max-w-md mx-auto shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-700"></div>
            <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5 shadow-inner">⚡</div>
            <h3 className="text-base font-bold text-slate-200 tracking-tight">Indexation Active & Prête</h3>
            <p className="text-slate-500 text-xs mt-2.5 leading-relaxed max-w-xs mx-auto">
              Saisissez le nom complet ou le matricule unique d'un étudiant pour générer instantanément son dashboard de performances académiques.
            </p>
          </div>
        )}

        {palmares && !loading && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* CARTE ID ÉTUDIANT (PANEL SUPERIEUR) */}
            <div className="bg-slate-950 rounded-3xl border border-slate-800/80 p-5 sm:p-7 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
              <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-indigo-500 to-violet-500"></div>
              
              <div className="space-y-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-lg">
                    {getDynamicPromotion()}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg">
                    Session : {getAnneeLabel()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    {palmares.etudiant?.prenom} {palmares.etudiant?.nom}
                  </h2>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1.5">
                    <span className="text-slate-600">✉</span> {palmares.etudiant?.email}
                  </p>
                </div>
              </div>

              {/* Badge Matricule Block */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-5 py-3 font-mono text-center md:text-left w-full md:w-auto shadow-inner">
                <span className="text-slate-500 block text-[9px] font-bold uppercase tracking-widest font-sans mb-1">Matricule d'Identification</span>
                <span className="font-bold text-sm bg-gradient-to-r from-slate-200 to-white bg-clip-text text-transparent">{palmares.etudiant?.matriculeUnique}</span>
              </div>
            </div>

            {/* TABLEAU DES NOTES (RESPONSIVE CARD) */}
            <div className="bg-slate-900/40 rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-900/60 flex justify-between items-center">
                <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Unités d'Enseignements validées</h4>
                <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700/60 px-2.5 py-0.5 rounded-full font-bold">{filteredResultats.length} matière(s)</span>
              </div>

              {/* Conteneur pour défilement tactile sur Mobile */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-900/20 text-slate-500 font-bold text-[10px] uppercase border-b border-slate-800 tracking-wider">
                      <th className="px-6 py-4">Intitulé de la Matière</th>
                      <th className="px-6 py-4 text-center">Semestre</th>
                      <th className="px-6 py-4 text-center">Volume Crédits</th>
                      <th className="px-6 py-4 text-right pr-8">Note d'Évaluation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-xs font-semibold text-slate-300">
                    {filteredResultats.length > 0 ? (
                      filteredResultats.map((res) => (
                        <tr key={res.id} className="hover:bg-slate-900/50 transition-colors group">
                          <td className="px-6 py-4 font-bold text-slate-200 group-hover:text-white transition-colors">
                            {res.matiere}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="bg-slate-900 text-slate-400 border border-slate-800 px-2.5 py-1 rounded-lg font-bold text-[10px]">
                              {res.semestre?.nom || `Semestre ${res.semestre?.id}`}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center font-mono font-bold text-slate-500">
                            {res.credit} <span className="text-[9px] text-slate-600 font-sans">Crs</span>
                          </td>
                          <td className="px-6 py-4 text-right pr-8 font-mono">
                            <span className={`inline-block font-extrabold text-xs px-3 py-1 rounded-xl shadow-inner ${
                              res.note >= 10 
                                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' 
                                : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                            }`}>
                              {res.note ? res.note.toFixed(1) : '0.0'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-slate-600 font-medium italic">
                          Aucune donnée d'évaluation répertoriée pour ce filtre.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* METRICS DU RELEVÉ DE NOTES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Carte Moyenne */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-full blur-2xl group-hover:bg-indigo-600/10 transition-all"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Moyenne Générale Pondérée</span>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-4xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent font-mono tracking-tight">
                    {palmares.moyenneGenerale ? palmares.moyenneGenerale.toFixed(2) : '0.00'}
                  </span>
                  <span className="text-slate-600 text-xs font-bold font-mono">/ 20.00</span>
                </div>
              </div>

              {/* Carte Mention */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/5 rounded-full blur-2xl group-hover:bg-emerald-600/10 transition-all"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Statut & Décision du Jury</span>
                <div className="mt-4 flex items-center">
                  {getMentionBadge(palmares.mention)}
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;