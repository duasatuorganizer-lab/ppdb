import { Applicant } from '../types';
import { formatRupiah, SCHOOL_INFO } from '../data/ppdbData';

export interface GoogleDriveFile {
  id: string;
  name: string;
  webViewLink?: string;
  modifiedTime?: string;
}

export interface SheetExportResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  rowCount: number;
}

export const PPDB_COLUMNS = [
  'No Registrasi',
  'Waktu Daftar',
  'Jenjang',
  'Gelombang',
  'Nama Calon Siswa',
  'Jenis Kelamin',
  'NIK',
  'NISN',
  'Tempat Lahir',
  'Tanggal Lahir',
  'Asal Sekolah',
  'Alamat',
  'Catatan / Hafalan',
  'Nama Ayah',
  'No WA Ayah',
  'Pekerjaan Ayah',
  'Nama Ibu',
  'No WA Ibu',
  'Pekerjaan Ibu',
  'Biaya Formulir',
  'Uang Pangkal (Setelah Diskon)',
  'BOKS',
  'SPP Juli 2027',
  'Seragam',
  'Total Komitmen PPDB',
  'Status Pembayaran Formulir',
  'Status Seleksi PPDB',
  'Jadwal Observasi',
  'Lokasi Observasi',
  'Catatan Panitia'
];

export const applicantToRowValues = (app: Applicant): (string | number)[] => [
  app.id,
  app.registeredAt,
  app.financial.levelName,
  app.financial.waveName,
  app.student.fullName,
  app.student.gender === 'L' ? 'Ikhwan' : 'Akhwat',
  app.student.nik,
  app.student.nisn || '-',
  app.student.birthPlace,
  app.student.birthDate,
  app.student.previousSchool || '-',
  app.student.address,
  app.student.specialNotes || '-',
  app.parent.fatherName || '-',
  app.parent.fatherPhone || '-',
  app.parent.fatherJob || '-',
  app.parent.motherName || '-',
  app.parent.motherPhone || '-',
  app.parent.motherJob || '-',
  app.financial.registrationFee,
  app.financial.uangPangkalFinal,
  app.financial.boks,
  app.financial.spp,
  app.financial.seragam,
  app.financial.ppdbSubtotal,
  app.paymentStatus === 'SUDAH_BAYAR' ? 'LUNAS' : 'BELUM BAYAR',
  app.status,
  app.observationDate || '-',
  app.observationLocation || '-',
  app.adminNotes || '-'
];

/**
 * List Google Spreadsheets owned or accessible by user using Google Drive API
 */
export async function listUserSpreadsheets(accessToken: string): Promise<GoogleDriveFile[]> {
  const query = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet' and trashed=false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&orderBy=modifiedTime desc&pageSize=15&fields=files(id,name,webViewLink,modifiedTime)`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gagal mengambil daftar spreadsheet dari Google Drive (${response.status})`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Creates a brand new Google Spreadsheet for PPDB and writes all applicants into it
 */
export async function createPPDBSpreadsheet(
  accessToken: string,
  customTitle?: string,
  applicants: Applicant[] = []
): Promise<SheetExportResult> {
  const defaultTitle = `PPDB ${SCHOOL_INFO.shortName} TP ${SCHOOL_INFO.academicYear} - Rekap Data Pendaftar (${new Date().toLocaleDateString('id-ID')})`;
  const title = customTitle?.trim() || defaultTitle;

  const rows = applicants.map(applicantToRowValues);
  const allValues = [PPDB_COLUMNS, ...rows];

  // 1. Create Spreadsheet with Title and initial sheet
  const createPayload = {
    properties: {
      title
    },
    sheets: [
      {
        properties: {
          title: 'Rekap Pendaftar',
          gridProperties: {
            frozenRowCount: 1
          }
        }
      }
    ]
  };

  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(createPayload)
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal membuat Google Spreadsheet baru');
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
  const sheetId = sheetData.sheets?.[0]?.properties?.sheetId ?? 0;

  // 2. Populate values
  const range = 'Rekap Pendaftar!A1';
  const writeRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        range,
        majorDimension: 'ROWS',
        values: allValues
      })
    }
  );

  if (!writeRes.ok) {
    const err = await writeRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal mengisi data ke Google Spreadsheet');
  }

  // 3. Format header row (Emerald background, bold white text) via batchUpdate
  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          {
            repeatCell: {
              range: {
                sheetId,
                startRowIndex: 0,
                endRowIndex: 1
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.02,
                    green: 0.47,
                    blue: 0.34
                  },
                  textFormat: {
                    foregroundColor: {
                      red: 1.0,
                      green: 1.0,
                      blue: 1.0
                    },
                    bold: true,
                    fontSize: 11
                  },
                  horizontalAlignment: 'CENTER'
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
            }
          },
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: PPDB_COLUMNS.length
              }
            }
          }
        ]
      })
    });
  } catch (fmtError) {
    console.warn('Styling sheet batchUpdate warning:', fmtError);
    // Formatting is non-blocking, creation succeeded
  }

  return {
    spreadsheetId,
    spreadsheetUrl,
    rowCount: rows.length
  };
}

/**
 * Append or replace data in an existing Google Sheet
 */
export async function syncToExistingSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  applicants: Applicant[],
  mode: 'REPLACE' | 'APPEND' = 'REPLACE'
): Promise<SheetExportResult> {
  // Check sheet metadata to find first sheet name
  const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!metaRes.ok) {
    const err = await metaRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal membaca metadata Spreadsheet');
  }

  const metaData = await metaRes.json();
  const firstSheet = metaData.sheets?.[0]?.properties;
  const sheetTitle = firstSheet?.title || 'Sheet1';

  if (mode === 'REPLACE') {
    // Clear existing content and rewrite with headers
    const rows = applicants.map(applicantToRowValues);
    const allValues = [PPDB_COLUMNS, ...rows];

    // Clear range
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}:clear`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const updateRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(`${sheetTitle}!A1`)}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          range: `${sheetTitle}!A1`,
          majorDimension: 'ROWS',
          values: allValues
        })
      }
    );

    if (!updateRes.ok) {
      const err = await updateRes.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Gagal memperbarui data Spreadsheet');
    }

    return {
      spreadsheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
      rowCount: rows.length
    };
  } else {
    // Append rows
    const rows = applicants.map(applicantToRowValues);
    const appendRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(`${sheetTitle}!A:A`)}:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          majorDimension: 'ROWS',
          values: rows
        })
      }
    );

    if (!appendRes.ok) {
      const err = await appendRes.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Gagal menambahkan baris ke Spreadsheet');
    }

    return {
      spreadsheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
      rowCount: rows.length
    };
  }
}

/**
 * Fetch rows from Google Sheet to view live preview in the app
 */
export async function readSpreadsheetRows(
  accessToken: string,
  spreadsheetId: string,
  range?: string
): Promise<{ headers: string[]; rows: string[][] }> {
  let targetRange = range;
  if (!targetRange) {
    // get first sheet title
    const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (metaRes.ok) {
      const metaData = await metaRes.json();
      const firstSheet = metaData.sheets?.[0]?.properties?.title || 'Sheet1';
      targetRange = `${firstSheet}!A1:AD50`;
    } else {
      targetRange = 'A1:AD50';
    }
  }

  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(targetRange)}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal membaca isi Google Spreadsheet');
  }

  const data = await res.json();
  const values: string[][] = data.values || [];
  if (values.length === 0) {
    return { headers: [], rows: [] };
  }

  return {
    headers: values[0] || [],
    rows: values.slice(1)
  };
}
