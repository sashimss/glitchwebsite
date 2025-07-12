// lib/markdown.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { blogs } from '@/data/blogs';
import { Blog, BlogWithContent } from '@/types/';

const postsDirectory = path.join(process.cwd(), 'content/blogs');

export async function getMarkdownContent(slug: string): Promise<BlogWithContent | null> {
  // Find the blog in our data
  const blog = blogs.find(b => b.slug === slug);
  if (!blog) return null;

  try {
    // Read the markdown file
    const fullPath = path.join(postsDirectory, blog.markdownFile);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    
    const contentHtml = processedContent.toString();

    // Combine the data with the id and contentHtml
    return {
      ...blog,
      content: contentHtml,
      frontmatter: matterResult.data,
    };
  } catch (error) {
    console.error(`Error reading markdown file for slug ${slug}:`, error);
    return null;
  }
}

export function getAllBlogSlugs(): string[] {
  return blogs.map(blog => blog.slug);
}

export function getB