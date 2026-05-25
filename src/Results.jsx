// Results.jsx — Spark Survey Dashboard at /result

import { useState, useEffect } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  FaChartLine,
  FaQuestionCircle,
  FaUsers,
  FaDatabase,
  FaSearch,
} from "react-icons/fa";

// ─── Spark Logo ───────────────────────────────────────────────────────────
function SparkLogoWhite() {
  return (
    <img
      src="https://sparktraineeships.com/wp-content/uploads/2025/05/Main-Logo.svg"
      alt="Spark Logo"
      className="h-20 w-auto object-contain"
    />
  );
}

// ─── Color palette ────────────────────────────────────────────────────────
const COLORS = [
  "#f97316",
  "#3b82f6",
  "#10b981",
  "#a78bfa",
  "#f43f5e",
  "#fbbf24",
  "#06b6d4",
  "#84cc16",
];

const SECTION_COLORS = {
  "Section 1": "#3b82f6",
  "Section 2": "#10b981",
  "Section 3": "#f97316",
  "Section 4": "#a78bfa",
};

// ─── Stat card ────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color }) {
  return (
    <div
      className="rounded-2xl p-4 sm:p-6 flex flex-col gap-1"
      style={{
        background: "#1e2d5a",
        border: `1px solid ${color}33`,
      }}
    >
      <div className="text-2xl sm:text-3xl font-black" style={{ color }}>
        {value}
      </div>

      <div className="text-white font-semibold text-sm">{label}</div>

      {sub && <div className="text-slate-400 text-xs">{sub}</div>}
    </div>
  );
}

// ─── Custom tooltip ───────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-xl px-4 py-3 text-sm shadow-xl"
      style={{
        background: "#1e2d5a",
        border: "1px solid #334155",
      }}
    >
      <p className="text-slate-300 mb-1 font-semibold">{label}</p>

      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || "#f97316" }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

// ─── Question Bar Chart ───────────────────────────────────────────────────
function QuestionChart({ q, index }) {
  const [open, setOpen] = useState(index < 3);

  const isScale = q.answers.every((a) => !isNaN(Number(a.label)));

  const color = COLORS[index % COLORS.length];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "#1e2d5a",
        border: "1px solid #334155",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 sm:px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
          style={{ background: color }}
        >
          Q{q.questionId}
        </div>

        <span className="text-white text-xs sm:text-sm font-medium flex-1 leading-snug break-words">
          {q.questionText}
        </span>

        <span className="text-slate-400 text-[10px] sm:text-xs mr-2">
          {q.answers.reduce((s, a) => s + a.count, 0)} responses
        </span>

        <span className="text-slate-400 text-sm">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div className="px-3 sm:px-5 pb-5">
          {isScale ? (
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer
                width="100%"
                height={window.innerWidth < 640 ? 220 : 160}
              >
                <LineChart
                  data={[...q.answers].sort(
                    (a, b) => Number(a.label) - Number(b.label)
                  )}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                  />

                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                  />

                  <YAxis
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    allowDecimals={false}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke={color}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: color }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer
                width="100%"
                height={Math.max(
                  window.innerWidth < 640 ? 240 : 120,
                  q.answers.length * 38
                )}
              >
                <BarChart
                  data={q.answers.slice(0, 8)}
                  layout="vertical"
                  margin={{
                    left: 8,
                    right: 24,
                    top: 4,
                    bottom: 4,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    allowDecimals={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="label"
                    width={160}
                    tick={{
                      fill: "#cbd5e1",
                      fontSize: 11,
                    }}
                    tickLine={false}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Bar
                    dataKey="count"
                    name="Responses"
                    radius={[0, 6, 6, 0]}
                  >
                    {q.answers.slice(0, 8).map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Results Component ───────────────────────────────────────────────
export default function Results() {
  const [data, setData] = useState(null);

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [activeTab, setTab] = useState("overview");

  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/stats").then((r) => r.json()),
      fetch("/api/responses").then((r) => r.json()),
    ])
      .then(([stats, resp]) => {
        setData(stats);

        const userMap = {};

        (resp.docs || []).forEach((doc) => {
          if (!userMap[doc.username]) {
            userMap[doc.username] = {
              username: doc.username,
              sections: [],
            };
          }

          userMap[doc.username].sections.push(doc);
        });

        setUsers(Object.values(userMap));

        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0f172a" }}
      >
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🐟</div>

          <p className="text-blue-200 text-lg font-semibold">
            Loading results...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0f172a" }}
      >
        <div className="text-center max-w-md px-4">
          <div className="text-5xl mb-4">⚠️</div>

          <h2 className="text-white text-xl font-bold mb-2">
            Could not load results
          </h2>

          <p className="text-slate-400 text-sm mb-4">{error}</p>

          <p className="text-slate-500 text-xs">
            Make sure your backend server is running on port
            3001 and your MongoDB Atlas connection is active.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "overview",
      label: (
        <div className="flex items-center gap-2">
          <FaChartLine />
          Overview
        </div>
      ),
    },

    {
      id: "questions",
      label: (
        <div className="flex items-center gap-2">
          <FaQuestionCircle />
          Questions
        </div>
      ),
    },

    {
      id: "users",
      label: (
        <div className="flex items-center gap-2">
          <FaUsers />
          Users
        </div>
      ),
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#0f172a",
        fontFamily: "'Segoe UI',sans-serif",
      }}
    >
      {/* Navbar */}
      <nav
        className="sticky top-0 z-40 border-b border-white/10 px-3 sm:px-6 py-1 flex justify-center flex-wrap items-center gap-3 bg-white"
        
      >
        <SparkLogoWhite />

        <div className="h-6 w-px bg-white/20 ml-2" />

        <h1 className="text-Black font-bold text-sm sm:text-base md:text-lg">
          Survey Results
        </h1>

        
      </nav>

      <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === t.id
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-8">
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard
                label="Total Responses"
                value={data.totalResponses}
                sub="section submissions"
                color="#f97316"
              />

              <StatCard
                label="Unique Users"
                value={data.totalUsers}
                sub="participants"
                color="#3b82f6"
              />

              <StatCard
                label="Questions"
                value="25"
                sub="across 4 sections"
                color="#10b981"
              />

              <StatCard
                label="Completion"
                value={`${
                  data.totalUsers > 0
                    ? Math.round(
                        (data.totalResponses /
                          (data.totalUsers * 4)) *
                          100
                      )
                    : 0
                }%`}
                sub="avg section fill rate"
                color="#a78bfa"
              />
            </div>

            {/* Most Common User Responses */}
            <div
              className="rounded-2xl p-4 sm:p-6"
              style={{
                background: "#1e2d5a",
                border: "1px solid #334155",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <FaChartLine className="text-orange-400" />

                <h2 className="text-white font-bold text-sm sm:text-base">
                  Most Common User Responses
                </h2>
              </div>

              {data.questions.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8">
                  No analytics available yet.
                </p>
              ) : (
                <div className="w-full overflow-x-auto">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={data.questions.map((q) => ({
                        question: `Q${q.questionId}`,
                        responses: Math.max(
                          ...q.answers.map((a) => a.count)
                        ),
                      }))}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#334155"
                      />

                      <XAxis
                        dataKey="question"
                        tick={{
                          fill: "#94a3b8",
                          fontSize: 11,
                        }}
                      />

                      <YAxis
                        tick={{
                          fill: "#94a3b8",
                          fontSize: 11,
                        }}
                        allowDecimals={false}
                      />

                      <Tooltip content={<CustomTooltip />} />

                      <Line
                        type="monotone"
                        dataKey="responses"
                        stroke="#f97316"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          fill: "#f97316",
                        }}
                        activeDot={{ r: 6 }}
                        name="Most Common Response Count"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              <p className="text-slate-400 text-xs mt-4">
                Shows the highest selected answer count for each
                question.
              </p>
            </div>

            {/* Section Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Section completion */}
              <div
                className="rounded-2xl p-4 sm:p-6"
                style={{
                  background: "#1e2d5a",
                  border: "1px solid #334155",
                }}
              >
                <h2 className="text-white font-bold text-base mb-4">
                  Section Completions
                </h2>

                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={data.sectionsData}
                    margin={{ left: 0, right: 16 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#334155"
                    />

                    <XAxis
                      dataKey="section"
                      tick={{
                        fill: "#94a3b8",
                        fontSize: 11,
                      }}
                    />

                    <YAxis
                      tick={{
                        fill: "#94a3b8",
                        fontSize: 11,
                      }}
                      allowDecimals={false}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    <Bar
                      dataKey="count"
                      name="Completions"
                      radius={[6, 6, 0, 0]}
                    >
                      {data.sectionsData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={
                            SECTION_COLORS[entry.section] ||
                            COLORS[i]
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie chart */}
              <div
                className="rounded-2xl p-4 sm:p-6"
                style={{
                  background: "#1e2d5a",
                  border: "1px solid #334155",
                }}
              >
                <h2 className="text-white font-bold text-base mb-4">
                  Section Share
                </h2>

                {data.sectionsData.every(
                  (s) => s.count === 0
                ) ? (
                  <p className="text-slate-400 text-sm text-center py-10">
                    No data yet.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={data.sectionsData}
                        dataKey="count"
                        nameKey="section"
                        cx="50%"
                        cy="50%"
                        outerRadius={75}
                        innerRadius={35}
                        paddingAngle={3}
                      >
                        {data.sectionsData.map((entry, i) => (
                          <Cell
                            key={i}
                            fill={
                              SECTION_COLORS[
                                entry.section
                              ] || COLORS[i]
                            }
                          />
                        ))}
                      </Pie>

                      <Tooltip content={<CustomTooltip />} />

                      <Legend
                        wrapperStyle={{
                          fontSize: 12,
                          color: "#94a3b8",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        )}

        {/* QUESTIONS TAB */}
        {activeTab === "questions" && (
          <div className="flex flex-col gap-4">
            <p className="text-slate-400 text-sm mb-2">
              Click any question to expand its response chart.
            </p>

            {data.questions.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                No question data yet.
              </div>
            ) : (
              data.questions.map((q, i) => (
                <QuestionChart
                  key={q.questionId}
                  q={q}
                  index={i}
                />
              ))
            )}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="flex flex-col gap-6">
            {/* Search */}
            <div className="relative w-full max-w-sm">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />

              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors"
              />
            </div>

            {filteredUsers.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                {users.length === 0
                  ? "No users yet."
                  : "No users match your search."}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredUsers.map((u, ui) => (
                  <div
                    key={ui}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "#1e2d5a",
                      border: "1px solid #334155",
                    }}
                  >
                    {/* User header */}
                    <div className="flex flex-wrap items-start sm:items-center gap-3 px-4 sm:px-5 py-4 border-b border-white/10">
                      <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-black text-base flex-shrink-0">
                        {u.username
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <p className="text-white font-bold">
                          {u.username}
                        </p>

                        <p className="text-slate-400 text-xs">
                          {u.sections.length} / 4 sections
                          completed ·{" "}
                          {u.sections.reduce(
                            (s, sec) =>
                              s + sec.responses.length,
                            0
                          )}{" "}
                          answers
                        </p>
                      </div>

                      <div className="ml-auto flex gap-1.5">
                        {[1, 2, 3, 4].map((n) => {
                          const done = u.sections.some(
                            (s) => s.section === n
                          );

                          return (
                            <div
                              key={n}
                              className="w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold"
                              style={{
                                background: done
                                  ? SECTION_COLORS[
                                      `Section ${n}`
                                    ]
                                  : "#334155",

                                color: done
                                  ? "#fff"
                                  : "#64748b",
                              }}
                            >
                              {n}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Answers */}
                    {u.sections
                      .sort((a, b) => a.section - b.section)
                      .map((sec, si) => (
                        <div
                          key={si}
                          className="px-4 sm:px-5 py-3 border-b border-white/5 last:border-0"
                        >
                          <p
                            className="text-xs font-bold mb-2"
                            style={{
                              color:
                                SECTION_COLORS[
                                  `Section ${sec.section}`
                                ] || "#f97316",
                            }}
                          >
                            Section {sec.section} —{" "}
                            {sec.sectionTitle}
                          </p>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2">
                            {sec.responses.map((r, ri) => (
                              <div
                                key={ri}
                                className="flex gap-2 text-xs"
                              >
                                <span className="text-slate-500 flex-shrink-0">
                                  Q{r.questionId}.
                                </span>

                                <span className="text-slate-300 flex-1 leading-snug break-words">
                                  {Array.isArray(r.answer)
                                    ? r.answer.join(", ")
                                    : String(
                                        r.answer ?? "—"
                                      )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}