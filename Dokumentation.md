# **Grundkonzept**

## **Zweck der Anwendung**
Die Anwendung dient als sicherer Passwort-Safe, in dem Benutzerdaten wie Zugangsdaten zu Webseiten und Programmen gespeichert, verwaltet und bei Bedarf angezeigt werden können. Sie bietet eine strukturierte und benutzerfreundliche Organisation der Daten sowie moderne Sicherheitsmechanismen, um die Vertraulichkeit zu gewährleisten.

---

## **Funktionalität der Anwendung**

### **Speicherung und Verwaltung von Zugangsdaten**
Die Anwendung speichert verschlüsselt folgende Informationen:
- URL der Webseite oder Name des Programms  
- Benutzername  
- Passwort  
- E-Mail-Adresse  
- Bemerkungen (z. B. Notizen zum Konto)  

### **Strukturierte Organisation**
- Die Daten können in Rubriken unterteilt werden, um die Übersichtlichkeit zu verbessern.  
  Beispiele:  
  - „Privates“  
  - „Geschäft“  
  - „Games“  
  - „Hobbies“  

### **Bearbeitungsoptionen**
Benutzer können:
- Einträge hinzufügen  
- Vorhandene Einträge bearbeiten  
- Einträge löschen  

### **Datenanzeige**
Nach erfolgreicher Authentifizierung können die gespeicherten Daten entschlüsselt und angezeigt werden.

---

## **Sicherheitskonzept**

### **1. Verschlüsselung**
- **Algorithmus:** AES (Advanced Encryption Standard) mit symmetrischer Verschlüsselung  
- **Begründung:**  
  Ursprünglich war RSA (asymmetrisches Verfahren) angedacht. Da jedoch keine Benutzerregistrierung vorgesehen ist, wäre die sichere Übergabe des privaten Schlüssels problematisch.  
  Deshalb wurde AES gewählt, da es einfacher implementierbar und für die Anforderungen des Projekts geeignet ist.

### **2. Passwort-Hashing**
- **Algorithmus:** Argon2  
- **Erweiterungen:**  
  - **Salt**: Zufällige Zeichenfolge, um die Einzigartigkeit jedes Hashs zu gewährleisten.  
  - **Pepper**: Ein zusätzlicher Sicherheitsparameter, der getrennt gespeichert wird.  

- **Speicherort des Pepper:** Eine sichere, separate Datei.

### **3. Key-Generierung**
- Aus dem Passwort des Benutzers wird ein Schlüssel (Key) generiert.  
- Dieser Schlüssel dient zur Entschlüsselung der Daten im Passwort-Safe.

---

## **Authentisierung und Autorisierung**

### **Zugang zur Anwendung**
- Über ein zentrales Login-Fenster meldet sich der Benutzer mit seinem Passwort an.  
- Das Passwort wird gehasht, um es nicht im Klartext zu speichern.  

### **Entschlüsselung der Daten**
- Nach erfolgreicher Authentifizierung wird der generierte Schlüssel genutzt, um die gespeicherten Daten zu entschlüsseln.  
- Die entschlüsselten Daten werden temporär im Arbeitsspeicher gehalten, um sie anzuzeigen.

---

## **Datenstruktur**

- Die Datenbank enthält folgende Felder:  
  - **URL**: Adresse der Webseite oder Name des Programms  
  - **Benutzername**: Anmeldedaten  
  - **Passwort**: Verschlüsselt gespeichert  
  - **E-Mail**: Optionales Feld zur Kontaktadresse  
  - **Bemerkungen**: Freitextfeld für Notizen  

- **Rubriken**:  
  - Die Datenbank unterstützt Rubriken, die zur Kategorisierung der Einträge dienen.  

---

## **Warum die Wahl?**

### **AES**
- Weit verbreitet, sicher und effizient.  
- Unterstützt hohe Schlüsselstärken (z. B. 256 Bit) für maximale Sicherheit.  

### **Argon2**
- Modernster Algorithmus, speziell für Passwort-Hashing entwickelt.  
- Schutz vor Brute-Force-Angriffen durch speicher- und zeitintensive Berechnung.  

### **Kombination aus Salt und Pepper**
- **Salt** macht jeden Hash einzigartig.  
- **Pepper** bietet zusätzliche Sicherheit, da er nicht in der Datenbank gespeichert wird.

---

## **Reflexion**

Es gab einige Probleme mit der Sicherheit und den Rechten, hier unten sind die grössten davon aufgelistet, sowie die anschliessend Lösung für die Probleme.

#### **Problem: Zugriff auf die H2-Konsole**
**Beschreibung**: Sicherheitsrichtlinien wie X-Frame-Options blockierten den Zugriff.

**Lösung**:
- Anpassung der `SecurityConfig`, um Frames von derselben Domain zu erlauben.
- CSRF-Schutz für die Konsole wurde deaktiviert (nur im Entwicklungsmodus).

#### **Problem: Konflikte zwischen H2 und API-Endpunkten**
**Beschreibung**: API-Endpunkte wie `/api/entries` wurden durch Sicherheitsregeln blockiert (403 Forbidden).

**Lösung**:
- Sicherheitsregeln wurden angepasst, um sowohl H2 als auch API-Endpunkte zugänglich zu machen.

#### **Problem: Unverschlüsselte Passwortspeicherung**
**Beschreibung**: Passwörter und Daten wurden anfangs unverschlüsselt gespeichert, was ein hohes Risiko darstellte.

**Lösung**:
- Einführung von AES-Verschlüsselung für Daten.
- Verwendung von Argon2-Hashing für Passwörter mit zusätzlichem Salt und Pepper.

#### **Problem: Unsichere Schlüsselverwaltung**
**Beschreibung**: Der AES-Schlüssel war direkt im Code hinterlegt, was unsicher ist.

**Lösung**:
- Auslagerung des Schlüssels in die `application.properties` und Konfiguration über Umgebungsvariablen.

#### **Problem: Fehlermeldungen und Debugging**
**Beschreibung**: Fehler wie 403 Forbidden oder „localhost hat die Verbindung abgelehnt“ waren schwer zu diagnostizieren.

**Lösung**:
- Systematische Tests mit Postman und Analyse der Logs ermöglichten die Eingrenzung und Behebung der Probleme.

#### **Problem: Unsichere Entwicklungsumgebung**
**Beschreibung**: Sicherheitsmechanismen wie CSRF wurden deaktiviert, was eine potenziell unsichere Umgebung schuf.

**Lösung**:
- Diese Maßnahmen wurden auf die lokale Entwicklung beschränkt.
- Ein Plan zur späteren Einführung von Authentifizierung (z. B. JWT) wurde definiert.

