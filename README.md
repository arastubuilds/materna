# Maternity Care Platform — AI-Powered Forum + RAG Chat Agent

A full-stack maternity-care knowledge platform featuring a community discussion forum and an intelligent Retrieval-Augmented Generation (RAG) chat assistant. Users can ask health-related questions, browse discussions, and receive AI-generated answers grounded in real community conversations and expert-document knowledge.

The system is built using **Next.js**, **TypeScript**, **AI-SDK**, **LangChain / LangGraph**, **Pinecone**, **PostgreSQL**, **Gemini-2.5-Flash**, and **HuggingFace embeddings**.

---

## Core Idea

The platform functions as both:

1. **A community forum** where mothers and caregivers can discuss and share experiences.
2. **A RAG-powered Chat Agent** that answers queries using:

   * Forum discussions (semantic + relational retrieval)
   * Pre-indexed PDF guides and medical reference documents

---

## Architecture Overview

### 1. Community Knowledge Base (PostgreSQL Structured Data)

* Stores posts, replies, categories and user activity
* Indexed and embedded for semantic retrieval
* Forms the experiential side of the knowledge graph

### 2. Static PDF Guide Knowledge Base

* Document corpus consists of maternity and health-care guides
* Pre-processed, chunked, and indexed using **Pinecone**
* Used when factual or guideline-based answers are needed

### 3. Dual-Resource Retrieval Agent

The RAG agent dynamically chooses the most relevant resource:

| Source           | Best For                                                  |
| ---------------- | --------------------------------------------------------- |
| **Forum KB**     | Experience-based, opinion-driven or situational questions |
| **PDF Guide KB** | Medical guidance, factual reference, step-based advice    |

Routing is handled via **LangGraph + AI-SDK tool calling**, allowing reasoning-based retrieval selection.

---

## Tech Stack

| Layer              | Tools Used                            |
| ------------------ | ------------------------------------- |
| Frontend + Backend | Next.js (App Router), TypeScript      |
| AI Framework       | LangChain, LangGraph                  |
| Vector Store       | Pinecone                              |
| Embeddings         | HuggingFace (768-dimensional)         |
| LLM                | Gemini-2.5-Flash                      |
| Database           | PostgreSQL (Drizzle ORM)              |
| Knowledge Stores   | Forum posts + PDF reference documents |

---

## Key Features

* Community forum with structured discussions
* AI chat support backed by real posts and medical references
* Dual-source RAG routing for accurate and contextual answers
* Pinecone semantic retrieval over both knowledge bases
* End-to-end typed development with TypeScript

---
