"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import AIAssistant from '@/components/AIAssistant/AIAssistant';
import ConceptQuiz from '@/components/ConceptQuiz';
import { HiOutlineHandThumbUp, HiOutlineBookmark, HiOutlineShare, HiOutlineCpuChip, HiOutlineTrash, HiOutlineLink, HiOutlineCheckCircle, HiOutlineClock, HiOutlineChevronUp } from 'react-icons/hi2';

export default function DoubtDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [doubt, setDoubt] = useState<any>(null);

  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [upvotedDoubt, setUpvotedDoubt] = useState(false);
  const [upvotedAnswers, setUpvotedAnswers] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [answerContent, setAnswerContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const addLink = () => {
    if (linkInput.trim() && !links.includes(linkInput.trim())) {
      setLinks(prev => [...prev, linkInput.trim()]);
    }
    setLinkInput('');
  };
  const [showAI, setShowAI] = useState(false);
  const [autoOpenAI, setAutoOpenAI] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchDoubt();
  }, [id, user]);

  const fetchDoubt = async () => {
    try {
      const res = await fetch(`/api/doubts/${id}`);
      const data = await res.json();
      if (data.doubt) {
        setDoubt(data.doubt);
        setHasBookmarked(data.hasBookmarked || false);
        setUpvotedDoubt(data.upvotedDoubt || false);
        setUpvotedAnswers(data.upvotedAnswers || []);

        if (data.doubt.answers.length === 0) {
          const createdAt = new Date(data.doubt.createdAt).getTime();
          const now = new Date().getTime();
          const fiveMinutes = 5 * 60 * 1000;

          if (now - createdAt >= fiveMinutes) {
            setAutoOpenAI(true);
          } else {
            const timeLeft = fiveMinutes - (now - createdAt);
            const timer = setTimeout(() => {
              setAutoOpenAI(true);
            }, timeLeft);
            return () => clearTimeout(timer);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Please login to answer');

    setSubmitting(true);
    try {
      const res = await fetch(`/api/doubts/${id}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: answerContent, images, links }),
      });
      if (res.ok) {
        setAnswerContent('');
        setImages([]);
        setLinks([]);
        fetchDoubt();
        router.refresh();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReaction = async (targetId: string, isDoubt: boolean) => {
    if (!user) return alert('Please login to upvote');

    if (isDoubt) {
      const action = upvotedDoubt ? -1 : 1;
      setUpvotedDoubt(!upvotedDoubt);
      setDoubt({ ...doubt, _count: { ...doubt._count, reactions: doubt._count.reactions + action } });
    } else {
      const hasUpvoted = upvotedAnswers.includes(targetId);
      if (hasUpvoted) {
        setUpvotedAnswers(prev => prev.filter(x => x !== targetId));
      } else {
        setUpvotedAnswers(prev => [...prev, targetId]);
      }
      setDoubt((prev: any) => {
        const answers = prev.answers.map((ans: any) => {
          if (ans.id === targetId) {
            return { ...ans, _count: { reactions: ans._count.reactions + (hasUpvoted ? -1 : 1) } };
          }
          return ans;
        });
        return { ...prev, answers };
      });
    }

    await fetch('/api/reactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isDoubt ? { doubtId: id } : { answerId: targetId, doubtId: id }),
    });
  };

  const toggleBookmark = async () => {
    if (!user) return alert('Please login to bookmark');
    const res = await fetch(`/api/bookmarks/${id}`, {
      method: hasBookmarked ? "DELETE" : "POST"
    });

    if (res.ok) {
      setHasBookmarked(!hasBookmarked);
    }
  };

  const handleMarkBest = async (answerId: string) => {
    if (!user || user.id !== doubt.authorId) return;
    await fetch(`/api/answers/${answerId}/best`, { method: 'POST' });
    fetchDoubt();
  };

  const handleGenerateAI = async () => {
    setGeneratingAI(true);
    try {
      const res = await fetch('/api/ai-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doubtId: id }),
      });
      if (res.ok) {
        fetchDoubt();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to generate AI explanation');
      }
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleShare = async () => {
    if (!user) return alert('Please login to share');
    const targetUsername = window.prompt("Enter the username of the person you want to share this doubt with:");
    if (!targetUsername) return;

    try {
      const res = await fetch('/api/shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doubtId: id, targetUsername }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to share');
      alert(`Successfully shared with ${targetUsername}!`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this doubt? This cannot be undone.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/doubts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete doubt');
      }
    } finally {
      setDeleting(false);
    }
  };

  const deleteAnswer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this answer?')) return;
    await fetch(`/api/answers/${id}`, {
      method: "DELETE"
    });
    window.location.reload();
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>;
  if (!doubt) return <div style={{ textAlign: 'center', padding: '4rem' }}>Doubt not found</div>;

  return (
    <div style={{ maxWidth: '1100px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '80px' }}>
      <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '1.75rem', alignItems: 'start' }}>
        <section>
          {/* Question Section */}
          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h1 style={{ fontSize: '1.75rem', lineHeight: 1.3, color: 'var(--text-primary)' }}>
                {doubt.title}
              </h1>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div className="badge" style={{ backgroundColor: doubt.hub.color + '20', color: doubt.hub.color }}>
                  {doubt.hub.name}
                </div>
                {doubt.difficulty && (
                  <div className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
                    Diff: {doubt.difficulty}
                  </div>
                )}
                {doubt.priority && (
                  <div className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
                    Pri: {doubt.priority}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <span>Asked by <Link href={`/profile/${doubt.author.id}`} style={{ color: 'var(--accent-primary)' }}>{doubt.author.username}</Link></span>
              <span>•</span>
              <span>{new Date(doubt.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{doubt.views} views</span>
            </div>

            <div style={{ fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem', whiteSpace: 'pre-wrap' }}>
              {doubt.description}
            </div>

            {/* Whiteboard image (if attached) */}
            {doubt.whiteboardImage && (
              <div style={{ marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', padding: '1rem', background: '#ffffff' }}>
                <img src={doubt.whiteboardImage} alt="Whiteboard attachment" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            )}

            {doubt.codeSnippet && (
              <div style={{ background: '#0d0d0d', padding: '1rem', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', overflowX: 'auto', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <pre style={{ margin: 0, color: '#e5e7eb' }}>
                  <code>{doubt.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Attached Images */}
            {doubt.images && doubt.images.length > 0 && (
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {doubt.images.map((img: string, idx: number) => (
                  <img key={idx} src={img} alt="Attached" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
                ))}
              </div>
            )}

// ... [REST OF FILE CONTENT ABOVE THIS REMAINS UNCHANGED] ...
            {/* Attached Links */}
            {doubt.links && doubt.links.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Reference Links:</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {doubt.links.map((link: string, idx: number) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <HiOutlineLink size={16} className="text-gray-400" /> <a href={link} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => handleReaction(id, true)}
                className={upvotedDoubt ? "btn btn-primary" : "btn btn-secondary"}
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', gap: '6px' }}
              >
                <HiOutlineHandThumbUp size={16} /> Upvote ({doubt._count.reactions})
              </button>
              <button
                onClick={toggleBookmark}
                className={`px-4 py-2 rounded-lg ${hasBookmarked ? "bg-purple-500 text-white" : "border border-gray-500"}`}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <HiOutlineBookmark size={16} /> {hasBookmarked ? 'Saved' : 'Bookmark'}
              </button>
              <button
                onClick={handleShare}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', gap: '6px' }}
              >
                <HiOutlineShare size={16} /> Share
              </button>

              {!doubt.answers.some((a: any) => a.author.username === 'AI_SYSTEM') && (
                <button
                  onClick={handleGenerateAI}
                  disabled={generatingAI}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)', gap: '6px' }}
                >
                  <HiOutlineCpuChip size={16} /> {generatingAI ? 'Generating...' : 'Generate AI Explanation'}
                </button>
              )}

              {/* Delete — visible to author only */}
              {user && user.id === doubt.authorId && (
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="btn btn-danger"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', marginLeft: 'auto', gap: '6px' }}
                >
                  <HiOutlineTrash size={16} /> {deleting ? 'Deleting...' : 'Delete'}
                </button>
              )}
            </div>
          </div>

          {/* AI Explanation Section */}
          {doubt.answers.find((a: any) => a.author.username === 'AI_SYSTEM') && (
            <div
              className="glass-panel animate-fade-in"
              style={{
                padding: '1.5rem 2rem',
                marginBottom: '1rem',
                border: '1px solid rgba(99,102,241,0.2)',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(0,0,0,0) 100%)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <HiOutlineCpuChip size={24} className="text-indigo-400" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  AI Explanation
                </h3>
              </div>
              <div style={{ fontSize: '0.95rem', lineHeight: 1.75, whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>
                {doubt.answers.find((a: any) => a.author.username === 'AI_SYSTEM').content}
              </div>
              <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Generated by AI Assistant • Supports collaborative learning
              </div>
            </div>
          )}

          {/* Concept Check Quiz */}
          <ConceptQuiz doubtId={id} />

          {/* Answers Section */}
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{doubt.answers.length} Answers</h3>

          {doubt.answers.map((answer: any) => (
            <div key={answer.id} className="glass-panel relative" style={{ padding: '1.5rem', marginBottom: '1rem', border: answer.isBestAnswer ? '1px solid var(--accent-success)' : undefined }}>

              {(user?.id === answer.authorId || user?.id === doubt.authorId) && (
                <button
                  onClick={() => deleteAnswer(answer.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                  title="Delete Answer"
                >
                  <HiOutlineTrash size={18} />
                </button>
              )}

              {answer.isBestAnswer && (
                <div style={{ color: 'var(--accent-success)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <HiOutlineCheckCircle size={16} /> Best Answer
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                {/* Voting */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleReaction(answer.id, false)}
                    style={{ color: upvotedAnswers.includes(answer.id) ? 'var(--accent-primary)' : 'var(--text-muted)', fontSize: '1.2rem' }}>
                    <HiOutlineChevronUp size={20} />
                  </button>
                  <strong style={{ fontSize: '1.1rem' }}>{answer._count.reactions}</strong>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>
                    {answer.content}
                  </div>

                  {answer.images && answer.images.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {answer.images.map((img: string, idx: number) => (
                        <img key={idx} src={img} alt="Answer attachment" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
                      ))}
                    </div>
                  )}

                  {answer.links && answer.links.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.9rem' }}>
                        {answer.links.map((link: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-2"><HiOutlineLink size={14} className="text-gray-400" /> <a href={link} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>{link}</a></li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      {user && user.id === doubt.authorId && !answer.isBestAnswer && doubt.status === 'Open' && (
                        <button
                          onClick={() => handleMarkBest(answer.id)}
                          className="btn btn-secondary"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderColor: 'var(--accent-success)', color: 'var(--accent-success)' }}
                        >
                          Mark as Best
                        </button>
                      )}
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                      <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>answered {new Date(answer.createdAt).toLocaleDateString()}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Link href={`/profile/${answer.author.id}`} style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>
                          {answer.author.username}
                        </Link>
                        <span style={{ color: 'var(--text-muted)' }}>• {answer.author.reputation} rep</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Your Answer Section */}
          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Your Answer</h3>
            {user ? (
              <form onSubmit={handlePostAnswer}>
                <textarea
                  className="input"
                  rows={6}
                  value={answerContent}
                  onChange={e => setAnswerContent(e.target.value)}
                  placeholder="Write your answer here..."
                  required
                  style={{ marginBottom: '1rem' }}
                />

                <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Attach Images</label>
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="input" style={{ padding: '0.5rem', fontSize: '0.8rem' }} />
                    {images.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                        {images.map((img, idx) => (
                          <div key={idx} style={{ position: 'relative' }}>
                            <img src={img} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                            <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px' }}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Attach Links</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="url" value={linkInput} onChange={e => setLinkInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLink())} className="input" placeholder="https://..." style={{ padding: '0.5rem', fontSize: '0.8rem' }} />
                      <button type="button" onClick={addLink} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Add</button>
                    </div>
                    {links.length > 0 && (
                      <ul style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {links.map((link, idx) => (
                          <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                            <a href={link} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>{link}</a>
                            <button type="button" onClick={() => setLinks(links.filter((_, i) => i !== idx))} style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>✕</button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary" type="submit" disabled={submitting}>
                    {submitting ? 'Posting...' : 'Post Answer'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Please log in to post an answer.</p>
                <Link href="/login" className="btn btn-primary">Log In</Link>
              </div>
            )}
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className="right-sidebar flex flex-col gap-6 sticky top-24">
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Status</h4>
            <div className="badge" style={{ backgroundColor: doubt.status === 'Solved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: doubt.status === 'Solved' ? 'var(--accent-success)' : 'var(--accent-warning)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {doubt.status === 'Solved' ? <><HiOutlineCheckCircle size={16} /> Solved</> : <><HiOutlineClock size={16} /> Open (Waiting for answers)</>}
            </div>
          </div>

          {/* AI Assistant Component */}
          <AIAssistant doubtId={id} autoOpen={autoOpenAI} />
        </aside>
      </div>
    </div>
  );
}
