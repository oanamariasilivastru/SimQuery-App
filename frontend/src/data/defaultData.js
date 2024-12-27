// src/data/defaultData.js

export const defaultData = {
    hurricaneIan: {
      prompt: 'Impact of Hurricane Ian on Florida',
      searchWords: ['Hurricane Ian', 'Florida', 'evacuation', 'storm surge', 'damage'],
      similarSentences: [
        {
          sentence:
            'FORT MYERS (AP) - Hurricane Ian brought catastrophic flooding and winds over 150 mph to Florida’s Gulf Coast, causing severe damage and forcing thousands to evacuate. The storm made landfall as a Category 4 hurricane, cutting power to over 2.5 million residents.',
          score: 4.7,
        },
        {
          sentence:
            'Hurricane Ian is regarded as one of the most destructive storms in Florida’s history, with estimated economic losses exceeding $60 billion.',
          score: 4.5,
        },
        {
          sentence:
            'After the hurricane, emergency response teams distributed essential supplies and set up temporary shelters for displaced families.',
          score: 4.3,
        },
      ],
      contradictingSources: [
        {
          source: 'BBC News',
          sentence:
            'Reports suggest northern Florida experienced less severe damage than initially feared, with only localized flooding.',
          score: 4.2,
        },
        {
          source: 'CNN',
          sentence:
            'Some regions reported minimal storm surge and power outages, contradicting widespread catastrophic forecasts.',
          score: 4.1,
        },
      ],
    },
    volcanoIceland: {
      prompt: 'Volcanic Eruption in Iceland’s Reykjanes Peninsula',
      searchWords: ['volcano', 'Iceland', 'lava flow', 'eruption', 'Reykjanes'],
      similarSentences: [
        {
          sentence:
            'REYKJAVIK (Reuters) - A volcanic eruption on Iceland’s Reykjanes Peninsula spewed lava into the air, prompting evacuations and disrupting air traffic. The eruption follows weeks of seismic activity.',
          score: 4.65,
        },
        {
          sentence:
            'Lava flows covered three square kilometers, with emergency teams closely monitoring the affected area to prevent further risk.',
          score: 4.4,
        },
        {
          sentence:
            'Authorities warned residents and tourists to stay away from hazardous zones due to unpredictable volcanic activity.',
          score: 4.35,
        },
      ],
      contradictingSources: [
        {
          source: 'The Guardian',
          sentence:
            'Experts stated that the eruption posed minimal risk to populated areas, with lava flowing toward uninhabited regions.',
          score: 4.25,
        },
        {
          source: 'Sky News',
          sentence:
            'Despite dramatic images, the eruption’s long-term impact is expected to be limited, according to local geologists.',
          score: 4.15,
        },
      ],
    },
    earthquakeJapan: {
      prompt: 'Earthquake Strikes Tokyo - Magnitude 7.3',
      searchWords: ['earthquake', 'Tokyo', 'Japan', 'tsunami warning', 'seismic'],
      similarSentences: [
        {
          sentence:
            'TOKYO (NHK) - A 7.3 magnitude earthquake hit off the coast of Tokyo, causing building sways and triggering tsunami alerts. Authorities reported minor injuries and disruptions to train services.',
          score: 4.6,
        },
        {
          sentence:
            'Officials stated the quake caused power outages in some neighborhoods, but no major structural collapses were reported.',
          score: 4.45,
        },
        {
          sentence:
            'Emergency inspections were conducted on bridges and highways, with bullet trains resuming service after safety checks.',
          score: 4.25,
        },
      ],
      contradictingSources: [
        {
          source: 'Japan Times',
          sentence:
            'Seismologists confirmed the earthquake’s impact was less severe than predicted, with minimal damage reported in central Tokyo.',
          score: 4.35,
        },
        {
          source: 'The New York Times',
          sentence:
            'Although the quake was powerful, most businesses resumed normal operations the next day.',
          score: 4.2,
        },
      ],
    },
  };
  