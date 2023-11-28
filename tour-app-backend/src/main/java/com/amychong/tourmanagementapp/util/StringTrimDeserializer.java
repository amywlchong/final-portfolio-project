package com.amychong.tourmanagementapp.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;

public class StringTrimDeserializer extends JsonDeserializer<String> {

  @Override
  public String deserialize(JsonParser jsonParser, DeserializationContext deserializationContext)
      throws IOException {
    String value = jsonParser.getValueAsString();
    if (value == null) {
      return null;
    }

    value = value.trim();
    return value.isEmpty() ? null : value;
  }
}
