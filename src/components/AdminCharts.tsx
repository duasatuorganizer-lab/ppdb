import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Applicant, EducationLevel, WaveType } from '../types';
import { BarChart3, PieChart as PieIcon, School, Sparkles, TrendingUp, Users } from 'lucide-react';

interface AdminChartsProps {
  applicants: Applicant[];
}

const LEVEL_LABELS: Record<EducationLevel, string> = {
  TKIT_A: 'TKIT A',
  TKIT_B: 'TKIT B',
  SDIT: 'SDIT At Taufiq',
  SMPIT: 'SMPIT At Taufiq'
};

const WAVE_LABELS: Record<WaveType, string> = {
  OPEN_HOUSE: 'Open House',
  GELOMBANG_1: 'Gelombang 1',
  GELOMBANG_2: 'Gelombang 2',
  REGULER: 'Reguler'
};

const LEVEL_COLORS: Record<EducationLevel, string> = {
  TKIT_A: '#10B981', // emerald-500
  TKIT_B: '#059669', // emerald-600
  SDIT: '#0284C7',   // sky-600
  SMPIT: '#6366F1'   // indigo-500
};

const WAVE_COLORS: Record<WaveType, string> = {
  OPEN_HOUSE: '#047857', // emerald-700
  GELOMBANG_1: '#0D9488', // teal-600
  GELOMBANG_2: '#F59E0B', // amber-500
  REGULER: '#64748B'     // slate-500
};

export const AdminCharts: React.FC<AdminChartsProps> = ({ applicants }) => {
  const [chartTypeLevel, setChartTypeLevel] = useState<'bar' | 'pie'>('bar');
  const [chartTypeWave, setChartTypeWave] = useState<'bar' | 'pie'>('bar');

  // 1. Data per Jenjang Pendidikan
  const levelCounts: Record<EducationLevel, { ikhwan: number; akhwat: number; total: number }> = {
    TKIT_A: { ikhwan: 0, akhwat: 0, total: 0 },
    TKIT_B: { ikhwan: 0, akhwat: 0, total: 0 },
    SDIT: { ikhwan: 0, akhwat: 0, total: 0 },
    SMPIT: { ikhwan: 0, akhwat: 0, total: 0 }
  };

  applicants.forEach(app => {
    if (levelCounts[app.level]) {
      levelCounts[app.level].total += 1;
      if (app.student.gender === 'L') {
        levelCounts[app.level].ikhwan += 1;
      } else {
        levelCounts[app.level].akhwat += 1;
      }
    }
  });

  const levelData = (Object.keys(levelCounts) as EducationLevel[]).map(key => ({
    key,
    name: LEVEL_LABELS[key],
    total: levelCounts[key].total,
    ikhwan: levelCounts[key].ikhwan,
    akhwat: levelCounts[key].akhwat,
    color: LEVEL_COLORS[key]
  }));

  // 2. Data per Gelombang Pendaftaran
  const waveCounts: Record<WaveType, { lunas: number; belumBayar: number; total: number }> = {
    OPEN_HOUSE: { lunas: 0, belumBayar: 0, total: 0 },
    GELOMBANG_1: { lunas: 0, belumBayar: 0, total: 0 },
    GELOMBANG_2: { lunas: 0, belumBayar: 0, total: 0 },
    REGULER: { lunas: 0, belumBayar: 0, total: 0 }
  };

  applicants.forEach(app => {
    if (waveCounts[app.wave]) {
      waveCounts[app.wave].total += 1;
      if (app.paymentStatus === 'SUDAH_BAYAR') {
        waveCounts[app.wave].lunas += 1;
      } else {
        waveCounts[app.wave].belumBayar += 1;
      }
    }
  });

  const waveData = (Object.keys(waveCounts) as WaveType[]).map(key => ({
    key,
    name: WAVE_LABELS[key],
    total: waveCounts[key].total,
    lunas: waveCounts[key].lunas,
    belumBayar: waveCounts[key].belumBayar,
    color: WAVE_COLORS[key]
  }));

  // Top statistics
  const topLevel = [...levelData].sort((a, b) => b.total - a.total)[0];
  const topWave = [...waveData].sort((a, b) => b.total - a.total)[0];

  return (
    <div className="space-y-4">
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200">
            <TrendingUp className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              Visualisasi & Analisis Data Pendaftar PPDB
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Grafik interaktif distribusi calon siswa berdasarkan jenjang pendidikan dan gelombang pendaftaran
            </p>
          </div>
        </div>

        {/* Highlight Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {topLevel && topLevel.total > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
              <School className="w-3.5 h-3.5 text-emerald-600" />
              <span>Jenjang Terbanyak: <strong>{topLevel.name} ({topLevel.total})</strong></span>
            </div>
          )}
          {topWave && topWave.total > 0 && (
            <div className="bg-teal-50 border border-teal-200 text-teal-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Gelombang Utama: <strong>{topWave.name} ({topWave.total})</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Two Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* CHART 1: Jenjang Pendidikan */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
                <School className="w-4 h-4 text-sky-700" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Pendaftar per Jenjang Pendidikan
                </h4>
                <p className="text-[11px] text-slate-500">
                  Total pendaftar pada masing-masing unit pendidikan
                </p>
              </div>
            </div>

            {/* Toggle View */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setChartTypeLevel('bar')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  chartTypeLevel === 'bar'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Tampilan Grafik Batang"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Batang</span>
              </button>
              <button
                type="button"
                onClick={() => setChartTypeLevel('pie')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  chartTypeLevel === 'pie'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Tampilan Grafik Donat"
              >
                <PieIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Donat</span>
              </button>
            </div>
          </div>

          {/* Chart Rendering Container */}
          <div className="h-64 w-full pt-2">
            {applicants.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                Belum ada data pendaftar untuk divisualisasikan
              </div>
            ) : chartTypeLevel === 'bar' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={levelData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: '#475569' }} 
                    axisLine={{ stroke: '#CBD5E1' }}
                    tickLine={false}
                  />
                  <YAxis 
                    allowDecimals={false} 
                    tick={{ fontSize: 11, fill: '#475569' }} 
                    axisLine={{ stroke: '#CBD5E1' }}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-lg border border-slate-800 space-y-1">
                            <div className="font-bold text-emerald-400">{data.name}</div>
                            <div className="text-slate-200">Total Pendaftar: <strong>{data.total} siswa</strong></div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2">
                              <span>Ikhwan (L): {data.ikhwan}</span>
                              <span>•</span>
                              <span>Akhwat (P): {data.akhwat}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    align="right"
                    wrapperStyle={{ fontSize: 11, paddingBottom: 8 }}
                  />
                  <Bar dataKey="ikhwan" name="Ikhwan (L)" stackId="a" fill="#0284C7" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="akhwat" name="Akhwat (P)" stackId="a" fill="#EC4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={levelData.filter(d => d.total > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="total"
                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {levelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white text-xs p-2.5 rounded-xl shadow-lg border border-slate-800">
                            <span className="font-bold">{data.name}: </span>
                            <span className="text-emerald-400 font-bold">{data.total} siswa</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bottom Level Badges */}
          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 mt-2 text-center text-[11px]">
            {levelData.map((item) => (
              <div key={item.key} className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <div className="text-slate-500 font-medium truncate">{item.name}</div>
                <div className="text-sm font-black text-slate-800 mt-0.5">{item.total}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CHART 2: Gelombang Pendaftaran */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-teal-700" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Pendaftar per Gelombang Masuk
                </h4>
                <p className="text-[11px] text-slate-500">
                  Sebaran kuota & status pembayaran formulir
                </p>
              </div>
            </div>

            {/* Toggle View */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setChartTypeWave('bar')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  chartTypeWave === 'bar'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Tampilan Grafik Batang"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Batang</span>
              </button>
              <button
                type="button"
                onClick={() => setChartTypeWave('pie')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  chartTypeWave === 'pie'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Tampilan Grafik Donat"
              >
                <PieIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Donat</span>
              </button>
            </div>
          </div>

          {/* Chart Rendering Container */}
          <div className="h-64 w-full pt-2">
            {applicants.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                Belum ada data pendaftar untuk divisualisasikan
              </div>
            ) : chartTypeWave === 'bar' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waveData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: '#475569' }} 
                    axisLine={{ stroke: '#CBD5E1' }}
                    tickLine={false}
                  />
                  <YAxis 
                    allowDecimals={false} 
                    tick={{ fontSize: 11, fill: '#475569' }} 
                    axisLine={{ stroke: '#CBD5E1' }}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white text-xs p-3 rounded-xl shadow-lg border border-slate-800 space-y-1">
                            <div className="font-bold text-teal-400">{data.name}</div>
                            <div className="text-slate-200">Total Pendaftar: <strong>{data.total} siswa</strong></div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2">
                              <span className="text-emerald-300">Lunas: {data.lunas}</span>
                              <span>•</span>
                              <span className="text-amber-300">Belum: {data.belumBayar}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    align="right"
                    wrapperStyle={{ fontSize: 11, paddingBottom: 8 }}
                  />
                  <Bar dataKey="lunas" name="Formulir Lunas" stackId="b" fill="#047857" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="belumBayar" name="Belum Bayar" stackId="b" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={waveData.filter(d => d.total > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="total"
                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {waveData.map((entry, index) => (
                      <Cell key={`cell-wave-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white text-xs p-2.5 rounded-xl shadow-lg border border-slate-800">
                            <span className="font-bold">{data.name}: </span>
                            <span className="text-teal-400 font-bold">{data.total} siswa</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bottom Wave Badges */}
          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 mt-2 text-center text-[11px]">
            {waveData.map((item) => (
              <div key={item.key} className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                <div className="text-slate-500 font-medium truncate">{item.name}</div>
                <div className="text-sm font-black text-slate-800 mt-0.5">{item.total}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
