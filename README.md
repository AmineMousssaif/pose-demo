# AI Gestuurde Thuismetingen voor JDM

Dit project ontwikkelt een AI-gestuurde applicatie voor thuismetingen voor kinderen met Juveniele Dermatomyositis (JDM). De applicatie maakt gebruik van PoseNet en BodyPix om menselijke poses te detecteren en te visualiseren via een live webcam-feed. Het doel is om de monitoring van spierbewegingen thuis mogelijk te maken zonder de noodzaak van specialistische apparatuur.
## Inhoudsopgave

- Overzicht
- Installatie
- Gebruik
    
    

## Overzicht

Deze applicatie is ontwikkeld als een proof-of-concept voor het gebruik van AI-modellen voor pose-detectie in thuismetingen. Het project richt zich op het gebruik van eenvoudige webcams en krachtige AI-modellen om de zorgkwaliteit voor kinderen met JDM te verbeteren door frequente en nauwkeurige monitoring van spierbewegingen mogelijk te maken.
Functies:

Realtime Pose-detectie: Detecteert en visualiseert menselijke poses in realtime via de webcam (Momenteeel 2 poses).
Gebruiksvriendelijke Interface: Eenvoudige interface geschikt voor kinderen en hun ouders.
Hands-free Bediening: Mogelijkheid om de tool hands-free te bedienen.
Weergave van Keypoints en Confidence Scores: Visualisatie van de gedetecteerde keypoints en hun nauwkeurigheid.



## Installatie

Clone de repository:

    bash

    git clone <repository-url>
    cd <repository-directory>



Start de webserver (bijvoorbeeld met Python's ingebouwde HTTP-server):

    bash

    python -m http.server

Open de applicatie in een webbrowser:
Ga naar http://localhost:8000 en open index.html.

## Gebruik

Start de applicatie: Open index.html in een webbrowser.
Schakel de webcam in: Geef de applicatie toegang tot je webcam.
Selecteer het model: Kies tussen PoseNet en BodyPix via de interface.
Begin met meten: Voer de oefeningen uit en bekijk de gedetecteerde poses en keypoints in realtime.




