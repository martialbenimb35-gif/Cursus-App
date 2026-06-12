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

        // Integration de l'API
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
    if (!mention) return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold">Sans mention</span>;
    if (mention.includes('Excellent') || mention.includes('Grande')) return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-4 py-1.5 rounded-full text-xs font-bold">✨ {mention}</span>;
    if (mention.includes('Bien') || mention.includes('Distinction')) return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-1.5 rounded-full text-xs font-bold">🔹 {mention}</span>;
    return <span className="bg-sky-50 text-sky-700 border border-sky-200 px-4 py-1.5 rounded-full text-xs font-bold">👍 {mention}</span>;
  };
  const filteredResultats = getFilteredResultats();

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 text-slate-800 antialiased font-sans">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 shadow-xs sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-md">🎓</div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">Système Cursus</h1>
              <p className="text-[10px] text-indigo-600 font-bold tracking-wider uppercase">Parcours Universitaire</p>
            </div>
          </div>
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2.5 w-full lg:w-auto relative">
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedAnnee}
                onChange={(e) => setSelectedAnnee(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-slate-100 text-xs font-bold border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white w-full transition-all cursor-pointer text-slate-700">
                <option value="1">Année Académique 2023-2024</option>
                <option value="2">Année Académique 2024-2025</option>
                <option value="3">Année Académique 2025-2026</option>
              </select>
              <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-slate-400 text-[10px]">▼</div>
            </div>
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedSemestre}
                onChange={(e) => setSelectedSemestre(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-xl bg-slate-100 text-xs font-bold border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white w-full transition-all cursor-pointer text-slate-700"
              >
                <option value="all">Tous les Semestres</option>
                <option value="1">Premier Semestre</option>
                <option value="2">Second Semestre</option>
              </select>
              <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-slate-400 text-[10px]">▼</div>
            </div>
            <div className="relative w-full sm:w-48">
              <input
                type="text"
                placeholder="Tapez le nom ou le matricule de l'etudiant"
                value={searchQuery}
                onChange={handleInputChange}
                className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white w-full transition-all"
                required
              />
              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto z-50 divide-y divide-slate-100">
                  {suggestions.map((etudiant) => (
                    <div
                      key={etudiant.id}
                      onClick={() => handleSelectEtudiant(etudiant)}
                      className="px-4 py-2.5 text-xs hover:bg-indigo-50 cursor-pointer flex justify-between items-center transition-colors"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{etudiant.prenom} {etudiant.nom}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">{etudiant.matriculeUnique}</span>
                      </div>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-sm font-mono text-slate-500">Choisir</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-md cursor-pointer whitespace-nowrap w-full sm:w-auto"
            >
              Lancer
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-10">
        
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl text-xs font-bold shadow-xs mb-6 max-w-md mx-auto">
            ⚠️ {error}
          </div>
        )}

        {!palmares && !error && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/60 p-8 max-w-md mx-auto shadow-xl">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">✨</div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Recherche Instantanée active</h3>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">
              Commencez simplement à saisir le nom de votre étudiant, la liste s'adaptera automatiquement à chaque lettre tapée.
            </p>
          </div>
        )}

        {palmares && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-md">
                    Promotion active : {getDynamicPromotion()}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-md">
                    Période : {getAnneeLabel()}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mt-3 tracking-tight">
                  {palmares.etudiant?.prenom} {palmares.etudiant?.nom}
                </h2>
                <p className="text-xs text-slate-500 mt-1">📧 {palmares.etudiant?.email}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-2.5 font-mono text-xs w-full md:w-auto text-center md:text-left">
                <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider font-sans mb-0.5">Matricule</span>
                <span className="font-bold text-slate-800">{palmares.etudiant?.matriculeUnique}</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">Unités d'Enseignements</h4>
                <span className="text-[10px] text-slate-400 font-bold">{filteredResultats.length} matière(s)</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 text-slate-400 font-bold text-[10px] uppercase border-b border-slate-200/60 tracking-wider">
                      <th className="px-6 py-3.5">Intitulé de la Matière</th>
                      <th className="px-6 py-3.5">Promotion</th>
                      <th className="px-6 py-3.5 text-center">Semestre</th>
                      <th className="px-6 py-3.5 text-center">Volume Crédits</th>
                      <th className="px-6 py-3.5 text-right pr-8">Note d'Évaluation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {filteredResultats.length > 0 ? (
                      filteredResultats.map((res) => (
                        <tr key={res.id} className="hover:bg-indigo-50/20 transition-all">
                          <td className="px-6 py-4 font-bold text-slate-900">{res.matiere}</td>
                          <td className="px-6 py-4 text-slate-500 text-[11px]">{res.promotion?.nom || 'N/A'}</td>
                          <td className="px-6 py-4 text-center">
                            <span className="bg-slate-100 text-slate-600 border border-slate-200/60 px-2 py-0.5 rounded-md font-bold text-[10px]">
                              {res.semestre?.nom || `Semestre ${res.semestre?.id}`}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center font-mono font-bold text-slate-400">{res.credit} Crs</td>
                          <td className="px-6 py-4 text-right pr-8 font-mono">
                            <span className={`inline-block font-bold text-sm px-2.5 py-0.5 rounded-lg ${res.note >= 10 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
                              {res.note ? res.note.toFixed(1) : '0.0'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-10 text-center text-slate-400 font-medium italic">
                          Aucune note disponible pour cette période ou ce semestre.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xl">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Performances Annuelles</span>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-4xl font-black text-slate-900 font-mono tracking-tight">
                    {palmares.moyenneGenerale ? palmares.moyenneGenerale.toFixed(2) : '0.00'}
                  </span>
                  <span className="text-slate-400 text-xs font-bold">/ 20.00</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xl">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Décision du Jury</span>
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