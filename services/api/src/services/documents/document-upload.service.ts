import fs from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

import { ApiError } from "../../errors/ApiError.js"

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads"

export async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR)
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
  }
}

export async function saveFile(
  file: {
    originalname: string
    buffer: Buffer
    mimetype: string
    size: number
  },
): Promise<{
  fileName: string
  filePath: string
  fileSize: number
  mimeType: string
}> {
  await ensureUploadDir()

  const ext = path.extname(file.originalname)
  const baseName = path.basename(file.originalname, ext)
  const uniqueId = randomUUID()
  const fileName = `${baseName}-${uniqueId}${ext}`
  const filePath = path.join(UPLOAD_DIR, fileName)

  await fs.writeFile(filePath, file.buffer)

  return {
    fileName: file.originalname,
    filePath,
    fileSize: file.size,
    mimeType: file.mimetype,
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath)
  } catch {
    // File may not exist, ignore
  }
}

export async function getFileContent(filePath: string): Promise<Buffer> {
  try {
    return await fs.readFile(filePath)
  } catch {
    throw new ApiError(404, "File not found.")
  }
}

export function getUploadDir(): string {
  return UPLOAD_DIR
}