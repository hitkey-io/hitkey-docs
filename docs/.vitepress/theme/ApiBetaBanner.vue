<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'

const { lang } = useData()

const message = computed(() => {
  const l = lang.value
  if (l.startsWith('ru'))
    return 'API находится в стадии beta и может измениться без предварительного уведомления.'
  if (l.startsWith('es'))
    return 'La API est\u00e1 en fase beta y puede cambiar sin previo aviso.'
  if (l.startsWith('kk'))
    return 'API beta кезеңінде және алдын ала ескертусіз өзгеруі мүмкін.'
  if (l.startsWith('tg'))
    return 'API дар марҳилаи beta аст ва бидуни огоҳии пешакӣ тағйир ёфта метавонад.'
  return 'The API is in beta and may change without prior notice.'
})
</script>

<template>
  <div class="beta-banner">
    <span class="beta-banner-icon">&#9888;</span>
    <span>{{ message }}</span>
  </div>
</template>
