<template>
  <fieldset
    class="pdx-radio-group"
    role="radiogroup"
    :aria-labelledby="legendId"
  >
    <!--
    Flex layouts are really weird when applied directly to fieldset, so we
    embrace div hell instead :-)
    -->
    <div class="pdx-radio-group__body">
      <legend
        :id="legendId"
        class="text-detail"
      >
        {{ label }}
      </legend>

      <pdx-radio-button
        v-for="option in options"
        :key="option"
        v-model="modelValue"
        :option
        :group-name
        :tooltip="tooltips?.[option]"
      />
    </div>
  </fieldset>
</template>

<script setup lang="ts" generic="T extends string">
/**
 * Using a generic instead of string allows more narrow types, since TS wouldn't
 * otherwise be able to correlate modelValue with props.options
 */
const modelValue = defineModel<T>({ required: true })

const props = defineProps<{
  label: string
  options: T[]
  tooltips?: Record<T, string>
}>()

const groupName = useId()

const legendId = useId()
</script>

<style lang="scss">
.pdx-radio-group {
  border: none;
  margin: 0;
  padding: 0;

  &__body {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  legend {
    padding: 0;
  }
}
</style>
