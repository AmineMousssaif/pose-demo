# AI Gestuurde Thuismetingen voor JDM

Dit project ontwikkelt een AI-gestuurde applicatie voor thuismetingen voor kinderen met Juveniele Dermatomyositis (JDM). De applicatie maakt gebruik van PoseNet en BodyPix om menselijke poses te detecteren en te visualiseren via een live webcam-feed. Het doel is om de monitoring van spierbewegingen thuis mogelijk te maken zonder de noodzaak van specialistische apparatuur.
## Inhoudsopgave

- Overzicht
- Installatie
- Gebruik
    
    

## Overzicht

Deze applicatie is ontwikkeld als een proof-of-concept voor het gebruik van AI-modellen voor pose-detectie in thuismetingen. Het project richt zich op het gebruik van eenvoudige webcams en krachtige AI-modellen om de zorgkwaliteit voor kinderen met JDM te verbeteren door frequente en nauwkeurige monitoring van spierbewegingen mogelijk te maken.
Functies:

- Realtime Pose-detectie: Detecteert en visualiseert menselijke poses in realtime via de webcam (Momenteeel 2 poses).
- Gebruiksvriendelijke Interface: Eenvoudige interface geschikt voor kinderen en hun ouders.
- Hands-free Bediening: Mogelijkheid om de tool hands-free te bedienen.
- Weergave van Keypoints en Confidence Scores: Visualisatie van de gedetecteerde keypoints en hun nauwkeurigheid.



## Installatie

Clone de repository:

    bash

    git clone <repository-url>
    cd <repository-directory>



Start de webserver (bijvoorbeeld met Python's ingebouwde HTTP-server):

    bash

    python -m http.server

- Open de applicatie in een webbrowser:
- Ga naar http://localhost:8000 en open index.html.

## Gebruik

- Start de applicatie: Open index.html in een webbrowser.
- Schakel de webcam in: Geef de applicatie toegang tot je webcam.
- Selecteer het model: Kies tussen PoseNet en BodyPix via de interface.
- Begin met meten: Voer de oefeningen uit en bekijk de gedetecteerde poses en keypoints in realtime.

## Demo instructies:
1.	Toegang tot de Applicatie

•	Open de Website: Navigeer naar pose.moussaif.be in je webbrowser. Zorg ervoor dat je een moderne browser gebruikt zoals Google Chrome, Firefox, of Edge voor de beste prestaties.


2.	Gebruikersinterface Overzicht

Wanneer je de applicatie opent, zie je de volgende componenten:

•	Videofeed: Een live feed van je webcam die in het midden van het scherm wordt weergegeven.
•	Detectiemodus: In de navigatie kan je schakelen van de verschillende AI-modellen: PoseNet, BodyPix en MoveNet. 
•	Start/Stop Knoppen: Knoppen om de pose-detectie te starten en te stoppen.
•	Opties: Extra instellingen en opties zoals het weergeven van keypoints en het inschakelen van specifieke detectie zoals hands-up en head-raise.

4.	Webcam Instellen:

•	Toestemming Geven: Bij het openen van de applicatie wordt gevraagd om toestemming te geven voor toegang tot je webcam. Klik op "Toestaan" om door te gaan.
•	Webcam Controleren: Zorg ervoor dat je webcam correct is aangesloten en functioneert. De live feed moet zichtbaar zijn in het videofeed-gebied van de applicatie.

5.	Pose-Detectie Starten:

•	Model Selecteren: Kies het gewenste AI-model voor pose-detectie (PoseNet, BodyPix, of MoveNet) door op de juiste  knop te klikken.
•	Start Detectie: Klik op de "Start" knop om de pose-detectie te beginnen. De applicatie begint onmiddellijk met het analyseren van de videofeed en het weergeven van gedetecteerde poses.
•	Weergave van Resultaten: Tijdens de detectie zie je de keypoints en skeletvisualisaties op de live videofeed. De applicatie toont ook de confidence scores van de gedetecteerde keypoints.

5. Specifieke Detectie Gebruiken:

•	Hands-up Detectie: Klik op de "Hands-up" modus om te detecteren wanneer beide handen omhoog zijn. Als deze positie wordt gedetecteerd, verandert de achtergrondkleur om dit aan te geven.
•	Head-raise Detectie: Klik op de "Head-raise" modus om te detecteren wanneer het hoofd omhoog is. Ook hier wordt de achtergrondkleur aangepast om succesvolle detectie aan te geven.

6. Pose-Detectie Stoppen

•	Stop Detectie: Klik op de "Stop" knop om de pose-detectie te beëindigen. De applicatie stopt met het analyseren van de videofeed en het weergeven van de resultaten.

7. Problemen Oplossen

•	Geen Videofeed: Als de videofeed niet wordt weergegeven, controleer dan of de webcam correct is aangesloten en of je browser toestemming heeft voor toegang tot de webcam.
•	Lagere Nauwkeurigheid: Zorg ervoor dat de lichtomstandigheden goed zijn en dat je volledig zichtbaar bent voor de webcam.
•	Technische Problemen: Probeer de pagina te vernieuwen of de browser opnieuw te starten. 






