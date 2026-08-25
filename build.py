#!/usr/bin/env python3
"""Build index.html from publications.json + the content below."""
import json, os, html
from datetime import date

ROOT = os.path.dirname(os.path.abspath(__file__))
PUBS = json.load(open(os.path.join(ROOT, "publications.json"), encoding="utf-8"))
try:
    META = json.load(open(os.path.join(ROOT, "meta.json"), encoding="utf-8"))
except Exception:
    META = {"updated": date.today().isoformat()}

TOPICS = {"honesty":"Dishonesty & Ethics","moral":"Moral Psychology","security":"Nuclear & Security",
          "openscience":"Open Science & Replication","climate":"Climate Change","health":"Health & COVID-19",
          "jdm":"Judgment & Decision-Making","social":"Social Psychology"}
METHODS = {"experiment":"Experiment","survey":"Survey","field":"Field experiment",
           "multilab":"Multi-lab / RRR","crossnational":"Cross-national","meta":"Meta-analysis"}
STRAND_COLORS = {"honesty":"#8c1933","moral":"#b8562f","security":"#00102e","openscience":"#2e6f5e",
                 "climate":"#4a7c3f","health":"#7a3b6b","jdm":"#c2953b","social":"#5a6b7d"}

NAME = "Marek Vranka"
ROLE = "Researcher in Social Psychology &amp; Behavioral Science"
INST = "Faculty of Social Sciences, Charles University"

BIO1 = """I am a researcher and lecturer in <strong>social psychology and behavioral science</strong> at
<a href="https://fsv.cuni.cz/en" target="_blank" rel="noopener">Charles University</a> in Prague, based at the
Institute of Communication Studies and Journalism and the
<a href="https://peaceresearch.cz/" target="_blank" rel="noopener">Peace Research Center Prague</a>.
I also work on the ERC-funded <em>MICROCODE</em> project on the microfoundations of nuclear order.

My research sits at the intersection of <strong>moral psychology, behavioral economics, and experimental
methodology</strong>. I study how people make moral and (dis)honest decisions, how the public forms attitudes
toward high-stakes security questions such as nuclear and autonomous weapons, and how psychological science
can be made more replicable."""

BIO2 = """A second strand of my work is <strong>metascience and open science</strong>. I have contributed to
large collaborative projects — Many Labs, Registered Replication Reports, and the
<a href="https://psysciacc.org/" target="_blank" rel="noopener">Psychological Science Accelerator</a> — and to
global tournaments on climate and health behaviour published in <em>Nature</em>,
<em>Nature Human Behaviour</em>, <em>Science Advances</em>, and <em>PNAS</em>.

I run experimental work through the <a href="https://www.pless.cz/" target="_blank" rel="noopener">PLESS</a>
laboratory in Prague, with a participant pool of more than 5,000 volunteers. My
<a href="https://orcid.org/0000-0003-3413-9062" target="_blank" rel="noopener">ORCID record</a> gives the
fullest overview of my publications."""

FOCUS = "moral judgment, (dis)honesty, nuclear &amp; security attitudes, replication"
METHODS_LINE = "lab &amp; field experiments, cross-national surveys, multi-lab replications"

NEWS = [
 ("Sep 2026","event","Organising the <strong>Metascience of Behavior Change</strong> (BRAINSTORM) meeting of international experts in Prague, 28–29 September."),
 ("2026","paper","New cross-national work on allied commitments, arms control and autonomous weapons in <em>EJIR</em>, <em>ISQ</em> and <em>Research &amp; Politics</em> (ERC MICROCODE)."),
 ("Jan 2027","event","<strong>CENTRAL workshop</strong> funded — Prague, January 2027."),
 ("2025","award","Completed my PhD in Social Psychology at the Faculty of Arts, Charles University."),
 ("2025","announcement","Joined the International Society for Moral Psychology and the Society for the Improvement of Psychological Science."),
 ("2024","paper","“Moral hypocrisy and the dichotomy of hypothetical versus real choices” published in the <em>Journal of Economic Psychology</em>."),
]
NEWS_LABEL = {"paper":"PAPER","event":"EVENT","award":"MILESTONE","announcement":"NEWS"}

TALKS_UP = [
 ("Sep 2026","SPAO conference — invited keynote","Moral judgment and behavioural science."),
 ("Sep 2026","BRAINSTORM expert meeting, Prague","Organiser &amp; host — Metascience of Behavior Change."),
 ("Jan 2027","CENTRAL workshop, Prague","Organiser."),
]
TALKS_PREV = [
 ("2022–24","Harvard Belfer Center — Beyond Nuclear Deterrence WG","Member, Harvard–MacArthur network."),
 ("2020","32nd International Congress of Psychology, Prague","Chair, Methodology in Psychology Working Group."),
]

EDU = [("2025","PhD, Social Psychology","Faculty of Arts, Charles University — supervisors Prof. Lenka Šulová &amp; Doc. Ilona Gillernová"),
       ("2014","MSc, Corporate Economics &amp; Management","Prague University of Economics and Business (minor: Behavioral Economics)"),
       ("2012","MA, Psychology","Faculty of Arts, Charles University")]
POS = [("2018 –","Researcher","Peace Research Center Prague, Charles University"),
       ("2016 –","Researcher &amp; Lecturer","Faculty of Social Sciences, Charles University"),
       ("2017 – 2024","Researcher; Head of CEVYZ Lab (2020–24)","Prague University of Economics and Business"),
       ("2018 – 2021","Deputy Head of Department","Faculty of Social Sciences, Charles University"),
       ("2016 – 2019","Researcher","National Institute of Mental Health, Klecany"),
       ("2012 – 2020","Lecturer","Faculty of Arts, Charles University")]
TEACH = ["Social Psychology","Methodology","Statistics","Moral Psychology","Behavioral Economics","Open Science","Experimental Psychology","Well-being"]
SERVICE = [("2026","Organiser, <em>Metascience of Behavior Change</em> (BRAINSTORM), Prague"),
           ("2022 –","Reviewer, Grant Agency of Charles University"),
           ("2022 – 2024","Member, Harvard Belfer Center — Beyond Nuclear Deterrence Working Group"),
           ("2020","Chair, Methodology Working Group, 32nd International Congress of Psychology"),
           ("2019 –","Reviewer, Technology Agency of the Czech Republic"),
           ("2013 –","Journal reviewer — Royal Society Open Science, JBDM, JBEE, Applied Economics, …")]
MEMBER = [("2026 –","International Society for Moral Psychology"),("2025 –","Society for the Improvement of Psychological Science"),
          ("2017 –","Psychological Science Accelerator"),("2016 –","Society for Judgment and Decision Making")]

STATS = dict(pubs=60, cites="2,795", h=26, first=10)
SELECTED_DOIS = ["10.1038/s41586-023-06840-9","10.1073/pnas.2111091119","10.1038/s41562-024-02009-0",
                 "10.1016/j.joep.2024.102772","10.1177/13540661251353107","10.1027/1864-9335/a000178"]

LINKS = [("Google Scholar","https://scholar.google.com/citations?user=","scholar"),
         ("ORCID","https://orcid.org/0000-0003-3413-9062","orcid"),
         ("OSF","https://osf.io/","osf"),
         ("Charles University","https://fsv.cuni.cz/contacts/people/32329117","cu")]

for i, p in enumerate(PUBS):
    p["id"] = i
    p.setdefault("co", [])
    p.setdefault("c", None)

# ---------------------------------------------------------------- fragments
def esc(s): return html.escape(s, quote=False)

def paras(t):
    return "".join("<p>%s</p>" % x.strip().replace("\n", " ") for x in t.split("\n\n"))

news_html = "".join(
    '<div class="news-item"><div class="news-meta"><span class="news-date">%s</span>'
    '<span class="news-badge %s">%s</span></div><div class="news-text">%s</div></div>'
    % (d, k, NEWS_LABEL[k], t) for d, k, t in NEWS)

def talk_rows(rows):
    return "".join('<div class="talk"><div class="talk-when">%s</div><div><div class="talk-title">%s</div>'
                   '<div class="talk-desc">%s</div></div></div>' % r for r in rows)

by_doi = {(p.get("doi") or "").lower(): p for p in PUBS}
sel = [by_doi[d.lower()] for d in SELECTED_DOIS if d.lower() in by_doi]
sel.sort(key=lambda p: -p["y"])
sel_html = "".join(
    '<div class="selpub" onclick="openPaper(%d)"><div class="selpub-title">%s</div>'
    '<div class="selpub-meta"><em>%s</em>, %s%s</div></div>'
    % (p["id"], esc(p["t2"]), esc(p["j"]), p["y"],
       (' · <span class="selpub-cite">%d cites</span>' % p["c"]) if p.get("c") else "")
    for p in sel)

cv_rows = lambda rows: "".join(
    '<div class="cv-item"><div class="cv-when">%s</div><div><div class="cv-t1">%s</div>%s</div></div>'
    % (r[0], r[1], ('<div class="cv-t2">%s</div>' % r[2]) if len(r) > 2 else "") for r in rows)

links_html = "".join('<a class="lnk" href="%s" target="_blank" rel="noopener">%s</a>' % (u, n) for n, u, _ in LINKS)
teach_html = "".join('<span class="pill">%s</span>' % t for t in TEACH)
journals = sorted(set(p["j"] for p in PUBS))
journal_opts = "".join('<option value="%s">%s</option>' % (esc(j), esc(j)) for j in journals)

from collections import Counter
co_counts = Counter(c for p in PUBS for c in p["co"])
TOP_CO = [n for n, _ in co_counts.most_common(12)]
co_chips = "".join('<button class="chip">%s</button>' % n for n in TOP_CO)

CSS = open(os.path.join(ROOT, "style.css"), encoding="utf-8").read()
JS = open(os.path.join(ROOT, "app.js"), encoding="utf-8").read()

TPL = open(os.path.join(ROOT, "template.html"), encoding="utf-8").read()

out = (TPL
    .replace("__CSS__", CSS)
    .replace("__JS__", JS)
    .replace("__NAME__", NAME)
    .replace("__ROLE__", ROLE)
    .replace("__INST__", INST)
    .replace("__BIO1__", paras(BIO1))
    .replace("__BIO2__", paras(BIO2))
    .replace("__FOCUS__", FOCUS)
    .replace("__METHODSLINE__", METHODS_LINE)
    .replace("__NEWS__", news_html)
    .replace("__TALKS_UP__", talk_rows(TALKS_UP))
    .replace("__TALKS_PREV__", talk_rows(TALKS_PREV))
    .replace("__SELPUBS__", sel_html)
    .replace("__EDU__", cv_rows(EDU))
    .replace("__POS__", cv_rows(POS))
    .replace("__TEACH__", teach_html)
    .replace("__SERVICE__", cv_rows(SERVICE))
    .replace("__MEMBER__", cv_rows(MEMBER))
    .replace("__LINKS__", links_html)
    .replace("__JOURNALS__", journal_opts)
    .replace("__COCHIPS__", co_chips)
    .replace("__NPUBS__", str(STATS["pubs"]))
    .replace("__NCITES__", STATS["cites"])
    .replace("__HINDEX__", str(STATS["h"]))
    .replace("__NFIRST__", str(STATS["first"]))
    .replace("__UPDATED__", META.get("updated", ""))
    .replace("__YEAR__", str(date.today().year))
    .replace("__PUBS_JSON__", json.dumps(PUBS, ensure_ascii=False))
    .replace("__TOPICS_JSON__", json.dumps(TOPICS, ensure_ascii=False))
    .replace("__METHODS_JSON__", json.dumps(METHODS, ensure_ascii=False))
    .replace("__COLORS_JSON__", json.dumps(STRAND_COLORS, ensure_ascii=False))
)

open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8").write(out)
print("Built index.html: %d KB, %d publications, %d with citations"
      % (len(out) / 1024, len(PUBS), sum(1 for p in PUBS if p.get("c") is not None)))
