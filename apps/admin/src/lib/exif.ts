import ExifReader from 'exifreader';

export interface PhotoMetadata {
  latitude?: number;
  longitude?: number;
  dateTime?: string;
  camera?: string;
  width?: number;
  height?: number;
}

export async function extractExifData(file: File): Promise<PhotoMetadata> {
  try {
    const tags = await ExifReader.load(file);

    const metadata: PhotoMetadata = {};

    // Extract GPS coordinates
    if (tags.GPSLatitude && tags.GPSLongitude) {
      const latRef = tags.GPSLatitudeRef?.value[0];
      const lonRef = tags.GPSLongitudeRef?.value[0];

      const lat = convertDMSToDD(
        tags.GPSLatitude.description,
        latRef
      );
      const lon = convertDMSToDD(
        tags.GPSLongitude.description,
        lonRef
      );

      if (lat !== null && lon !== null) {
        metadata.latitude = lat;
        metadata.longitude = lon;
      }
    }

    // Extract date/time
    if (tags.DateTime) {
      metadata.dateTime = tags.DateTime.description;
    }

    // Extract camera info
    if (tags.Make && tags.Model) {
      metadata.camera = `${tags.Make.description} ${tags.Model.description}`;
    }

    // Extract dimensions
    if (tags.ImageWidth && tags.ImageHeight) {
      metadata.width = tags.ImageWidth.value;
      metadata.height = tags.ImageHeight.value;
    } else if (tags['Image Width'] && tags['Image Height']) {
      metadata.width = tags['Image Width'].value;
      metadata.height = tags['Image Height'].value;
    }

    return metadata;
  } catch (error) {
    console.error('EXIF extraction error:', error);
    return {};
  }
}

// Convert GPS coordinates from DMS (Degrees Minutes Seconds) to DD (Decimal Degrees)
function convertDMSToDD(dms: string, ref: string): number | null {
  try {
    // Parse DMS string (e.g., "42° 8' 0.00"")
    const parts = dms.match(/(\d+)°\s*(\d+)'\s*([\d.]+)"/);

    if (!parts) return null;

    const degrees = parseFloat(parts[1]);
    const minutes = parseFloat(parts[2]);
    const seconds = parseFloat(parts[3]);

    let dd = degrees + minutes / 60 + seconds / 3600;

    // Adjust for hemisphere
    if (ref === 'S' || ref === 'W') {
      dd = -dd;
    }

    return dd;
  } catch (error) {
    console.error('DMS conversion error:', error);
    return null;
  }
}
